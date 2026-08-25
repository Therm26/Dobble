import { ref, set, get, update, onValue, runTransaction, remove } from 'firebase/database'
import { db, isFirebaseConfigured } from './firebase'
import { generateDobbleDeck, shuffle } from './dobble'

// Sans caractères ambigus (0/O, 1/I/L) pour rester lisible quand on
// dicte le code à l'oral.
const CODE_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'

export function generateRoomCode() {
  let code = ''
  for (let i = 0; i < 4; i++) {
    code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]
  }
  return code
}

function makePlayerId() {
  return Math.random().toString(36).slice(2, 10)
}

export async function createRoom(hostName) {
  if (!isFirebaseConfigured) throw new Error('not-configured')

  const code = generateRoomCode()
  const hostId = makePlayerId()
  const deck = shuffle(generateDobbleDeck(7))

  await set(ref(db, `rooms/${code}`), {
    hostId,
    createdAt: Date.now(),
    status: 'waiting',
    deck,
    consumed: 0,
    players: {
      [hostId]: { name: hostName, score: 0, color: 0 },
    },
  })

  return { code, playerId: hostId }
}

export async function joinRoom(code, guestName) {
  if (!isFirebaseConfigured) throw new Error('not-configured')

  const roomRef = ref(db, `rooms/${code}`)
  const snap = await get(roomRef)
  if (!snap.exists()) throw new Error('not-found')

  const room = snap.val()
  const playerIds = Object.keys(room.players || {})
  if (playerIds.length >= 2) throw new Error('full')

  const guestId = makePlayerId()
  await update(roomRef, {
    [`players/${guestId}`]: { name: guestName, score: 0, color: 1 },
    status: 'playing',
  })

  return { code, playerId: guestId }
}

export function listenToRoom(code, callback) {
  const roomRef = ref(db, `rooms/${code}`)
  return onValue(roomRef, (snap) => callback(snap.val()))
}

// Course au clic : seul le client dont la transaction est "committed" a
// réellement marqué le point (voir le plan pour le détail du mécanisme).
export async function claimPoint(code, playerId, expectedConsumed) {
  const roomRef = ref(db, `rooms/${code}`)
  const consumedRef = ref(db, `rooms/${code}/consumed`)

  const result = await runTransaction(consumedRef, (current) => {
    if (current !== expectedConsumed) return // quelqu'un d'autre a déjà marqué
    return current + 2
  })
  if (!result.committed) return false

  const snap = await get(roomRef)
  const room = snap.val()
  if (!room) return true

  const newConsumed = expectedConsumed + 2
  const newScore = (room.players[playerId]?.score || 0) + 1
  const updates = { [`players/${playerId}/score`]: newScore }
  if (newConsumed + 1 >= room.deck.length) {
    updates.status = 'finished'
  }
  await update(roomRef, updates)
  return true
}

export async function rematchRoom(code) {
  const roomRef = ref(db, `rooms/${code}`)
  const snap = await get(roomRef)
  const room = snap.val()
  if (!room) return

  const scoreResets = Object.fromEntries(
    Object.keys(room.players).map((id) => [`players/${id}/score`, 0])
  )
  await update(roomRef, {
    deck: shuffle(generateDobbleDeck(7)),
    consumed: 0,
    status: 'playing',
    ...scoreResets,
  })
}

export function leaveRoom(code) {
  return remove(ref(db, `rooms/${code}`)).catch(() => {})
}
