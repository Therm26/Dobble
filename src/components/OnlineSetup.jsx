import { useState } from 'react'
import { createRoom, joinRoom } from '../onlineRoom'

const NOT_CONFIGURED_MESSAGE = "Le mode en ligne n'est pas encore configuré."

export default function OnlineSetup({ onExit, onStart }) {
  const [mode, setMode] = useState('choose') // choose | create | join
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleCreate() {
    setBusy(true)
    setError('')
    try {
      const { code: roomCode, playerId } = await createRoom(name.trim() || 'Joueur')
      onStart(roomCode, playerId)
    } catch (e) {
      setError(e.message === 'not-configured' ? NOT_CONFIGURED_MESSAGE : 'Impossible de créer la partie. Vérifie ta connexion.')
      setBusy(false)
    }
  }

  async function handleJoin() {
    setBusy(true)
    setError('')
    try {
      const { code: roomCode, playerId } = await joinRoom(code, name.trim() || 'Joueur')
      onStart(roomCode, playerId)
    } catch (e) {
      if (e.message === 'not-configured') setError(NOT_CONFIGURED_MESSAGE)
      else if (e.message === 'not-found') setError('Code introuvable.')
      else if (e.message === 'full') setError('Cette partie est déjà complète.')
      else setError('Impossible de rejoindre la partie. Vérifie ta connexion.')
      setBusy(false)
    }
  }

  function backToChoose() {
    setMode('choose')
    setError('')
  }

  return (
    <div className="screen setup-screen">
      <button className="btn btn-ghost back-btn" onClick={onExit}>← Accueil</button>

      <div className="setup-panel">
        <h1>En ligne</h1>

        {mode === 'choose' && (
          <>
            <p className="subtitle">Joue en 1v1 à distance avec un code de partie.</p>
            <div className="mode-buttons">
              <button className="btn btn-primary" onClick={() => setMode('create')}>
                Créer une partie
              </button>
              <button className="btn btn-primary" onClick={() => setMode('join')}>
                Rejoindre une partie
              </button>
            </div>
          </>
        )}

        {mode !== 'choose' && (
          <div className="player-names">
            <input
              type="text"
              placeholder="Ton pseudo"
              value={name}
              maxLength={20}
              onChange={(e) => setName(e.target.value)}
            />
            {mode === 'join' && (
              <input
                type="text"
                placeholder="Code (ex: AB3D)"
                value={code}
                maxLength={4}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
              />
            )}
          </div>
        )}

        {error && <p className="error-text">{error}</p>}

        {mode === 'create' && (
          <button className="btn btn-primary" disabled={busy} onClick={handleCreate}>
            {busy ? 'Création…' : 'Créer'}
          </button>
        )}
        {mode === 'join' && (
          <button className="btn btn-primary" disabled={busy || code.length !== 4} onClick={handleJoin}>
            {busy ? 'Connexion…' : 'Rejoindre'}
          </button>
        )}
        {mode !== 'choose' && (
          <button className="btn btn-ghost" onClick={backToChoose}>← Retour</button>
        )}
      </div>
    </div>
  )
}
