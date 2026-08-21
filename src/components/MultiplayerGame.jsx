import { useState } from 'react'
import { generateDobbleDeck, shuffle, findCommonSymbol } from '../dobble'
import { PLAYER_COLORS } from '../playerColors'
import Card from './Card'

function initGame() {
  const deck = shuffle(generateDobbleDeck(7))
  return { playerCards: [deck[0], deck[1]], pile: deck.slice(2) }
}

export default function MultiplayerGame({ players, onExit }) {
  const [game, setGame] = useState(initGame)
  const [scores, setScores] = useState(() => players.map(() => 0))
  const [status, setStatus] = useState('playing') // playing | finished
  const [shakeIndex, setShakeIndex] = useState(null)

  const { playerCards, pile } = game

  function handleSymbolClick(playerIndex, symbol) {
    if (status !== 'playing') return
    const correct = findCommonSymbol(playerCards[playerIndex], playerCards[1 - playerIndex])

    if (symbol !== correct) {
      setShakeIndex(playerIndex)
      setTimeout(() => setShakeIndex(null), 300)
      return
    }

    setScores((s) => s.map((score, i) => (i === playerIndex ? score + 1 : score)))

    if (pile.length < 2) {
      setStatus('finished')
      return
    }
    setGame({ playerCards: [pile[0], pile[1]], pile: pile.slice(2) })
  }

  const maxScore = Math.max(...scores)
  const ranked = players
    .map((name, i) => ({ name, score: scores[i] }))
    .sort((a, b) => b.score - a.score)

  return (
    <div className="screen game-screen">
      <div className="game-header">
        <button className="btn btn-ghost" onClick={onExit}>← Accueil</button>
        <div className="progress">{pile.length} cartes restantes</div>
      </div>

      {status === 'finished' && (
        <div className="overlay">
          <h2>🏆 {ranked[0].name} gagne !</h2>
          <ol className="final-ranking">
            {ranked.map((p, i) => (
              <li key={i} className={p.score === maxScore ? 'winner' : ''}>
                {p.name} — {p.score} point{p.score > 1 ? 's' : ''}
              </li>
            ))}
          </ol>
          <button className="btn btn-ghost" onClick={onExit}>Accueil</button>
        </div>
      )}

      {status !== 'finished' && (
        <div className="multi-table">
          <div className="player-cards-row">
            {playerCards.map((card, i) => (
              <div key={i} className="player-card-wrap">
                <span
                  className="score-chip"
                  style={{ background: PLAYER_COLORS[i], color: 'white' }}
                >
                  {players[i]} : <strong>{scores[i]}</strong>
                </span>
                <Card
                  card={card}
                  accentColor={PLAYER_COLORS[i]}
                  shake={shakeIndex === i}
                  onSymbolClick={(symbol) => handleSymbolClick(i, symbol)}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
