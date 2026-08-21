import { useState } from 'react'
import { PLAYER_COLORS } from '../playerColors'

export default function MultiplayerSetup({ onStart, onExit }) {
  const [names, setNames] = useState(['Joueur 1', 'Joueur 2'])

  function updateName(index, value) {
    setNames(names.map((n, i) => (i === index ? value : n)))
  }

  return (
    <div className="screen setup-screen">
      <button className="btn btn-ghost back-btn" onClick={onExit}>← Accueil</button>

      <div className="setup-panel">
        <h1>Duo</h1>
        <p className="subtitle">
          Chaque joueur a sa propre carte. Premier à cliquer le bon symbole sur SA carte marque le point !
        </p>

        <div className="player-names">
          {names.map((name, i) => (
            <div key={i} className="player-name-row">
              <span className="color-dot" style={{ background: PLAYER_COLORS[i] }} />
              <input
                type="text"
                value={name}
                maxLength={20}
                onChange={(e) => updateName(i, e.target.value)}
              />
            </div>
          ))}
        </div>

        <button
          className="btn btn-primary"
          onClick={() => onStart(names.map((n) => n.trim() || `Joueur`))}
        >
          Commencer
        </button>
      </div>
    </div>
  )
}
