import { DECOR_COLORS } from '../decorColors'

const LETTERS = ['D', 'o', 'b', 'b', 'l', 'e']

export default function Home({ onSelectMode }) {
  return (
    <div className="screen home-screen">
      <div className="decor-dots" aria-hidden="true">
        {DECOR_COLORS.map((color, i) => (
          <span key={i} className={`decor-dot decor-dot-${i}`} style={{ background: color }} />
        ))}
      </div>

      <h1 className="wordmark">
        {LETTERS.map((letter, i) => (
          <span key={i} style={{ color: DECOR_COLORS[i % DECOR_COLORS.length] }}>
            {letter}
          </span>
        ))}
      </h1>
      <p className="subtitle">
        Trouve le symbole commun entre les deux cartes le plus vite possible !
      </p>

      <div className="mode-buttons">
        <button className="btn btn-primary" onClick={() => onSelectMode('solo')}>
          ⏱️ Solo contre la montre
        </button>
        <button className="btn btn-primary" onClick={() => onSelectMode('multi-setup')}>
          👥 Duo
        </button>
        <button className="btn btn-primary" onClick={() => onSelectMode('online-setup')}>
          🌐 En ligne
        </button>
      </div>

      <p className="rules">
        Deux cartes n'ont toujours qu'un seul symbole en commun. Clique dessus
        dès que tu l'as repéré !
      </p>
    </div>
  )
}
