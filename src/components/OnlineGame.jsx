import { useEffect, useRef, useState } from 'react'
import { listenToRoom, claimPoint, leaveRoom, rematchRoom } from '../onlineRoom'
import { findCommonSymbol } from '../dobble'
import { PLAYER_COLORS } from '../playerColors'
import { DECOR_COLORS } from '../decorColors'
import Card from './Card'

const CONFETTI_COUNT = 18

export default function OnlineGame({ code, playerId, onExit }) {
  const [room, setRoom] = useState(null)
  const [loaded, setLoaded] = useState(false)
  const [shake, setShake] = useState(false)
  const claimingRef = useRef(false)

  useEffect(() => {
    const unsubscribe = listenToRoom(code, (data) => {
      setLoaded(true)
      setRoom(data)
    })
    return unsubscribe
  }, [code])

  function handleExit() {
    if (room && room.status === 'finished') leaveRoom(code)
    onExit()
  }

  function handleRematch() {
    rematchRoom(code)
  }

  if (!room) {
    return (
      <div className="screen game-screen">
        <div className="overlay">
          <p>{loaded ? "Partie introuvable ou terminée." : 'Connexion…'}</p>
          <button className="btn btn-ghost" onClick={onExit}>Accueil</button>
        </div>
      </div>
    )
  }

  const playerIds = Object.keys(room.players)
  const table = room.deck[room.consumed]
  const drawCard = room.deck[room.consumed + 1]

  async function handleSymbolClick(symbol) {
    if (room.status !== 'playing' || claimingRef.current) return
    const correct = findCommonSymbol(table, drawCard)

    if (symbol !== correct) {
      setShake(true)
      setTimeout(() => setShake(false), 300)
      return
    }

    claimingRef.current = true
    await claimPoint(code, playerId, room.consumed)
    claimingRef.current = false
  }

  const ranked = playerIds
    .map((id) => room.players[id])
    .sort((a, b) => b.score - a.score)
  const maxScore = ranked[0]?.score ?? 0

  return (
    <div className="screen game-screen">
      <div className="game-header">
        <button className="btn btn-ghost" onClick={handleExit}>← Accueil</button>
        <div className="progress">Code : {code}</div>
      </div>

      {room.status === 'waiting' && (
        <div className="overlay">
          <p>En attente de l'adversaire…</p>
          <p className="room-code">{code}</p>
          <p className="subtitle">Partage ce code pour qu'il/elle te rejoigne.</p>
        </div>
      )}

      {room.status === 'finished' && (
        <div className="overlay">
          <div className="confetti" aria-hidden="true">
            {Array.from({ length: CONFETTI_COUNT }, (_, i) => (
              <span
                key={i}
                className="confetti-piece"
                style={{
                  left: `${(i * 97) % 100}%`,
                  background: DECOR_COLORS[i % DECOR_COLORS.length],
                  animationDelay: `${(i % 6) * 0.18}s`,
                }}
              />
            ))}
          </div>
          <h2 className="winner-heading">🏆 {ranked[0].name} gagne !</h2>
          <ol className="final-ranking">
            {ranked.map((p, i) => (
              <li key={i} className={p.score === maxScore ? 'winner' : ''}>
                {p.name} — {p.score} point{p.score > 1 ? 's' : ''}
              </li>
            ))}
          </ol>
          <div className="mode-buttons">
            <button className="btn btn-primary" onClick={handleRematch}>Rejouer</button>
            <button className="btn btn-ghost" onClick={handleExit}>Accueil</button>
          </div>
        </div>
      )}

      {room.status === 'playing' && (
        <div className="multi-table">
          <div className="scoreboard">
            {playerIds.map((id) => (
              <span
                key={id}
                className="score-chip"
                style={{ background: PLAYER_COLORS[room.players[id].color], color: 'white' }}
              >
                {room.players[id].name} : <strong>{room.players[id].score}</strong>
              </span>
            ))}
          </div>
          <div className="cards-row">
            <Card card={table} shake={shake} onSymbolClick={handleSymbolClick} />
            <Card card={drawCard} shake={shake} onSymbolClick={handleSymbolClick} />
          </div>
        </div>
      )}
    </div>
  )
}
