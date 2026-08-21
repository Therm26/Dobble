import { useEffect, useRef, useState } from 'react'
import { generateDobbleDeck, shuffle, findCommonSymbol } from '../dobble'
import Card from './Card'

function formatTime(ms) {
  const totalCentiseconds = Math.floor(ms / 10)
  const minutes = Math.floor(totalCentiseconds / 6000)
  const seconds = Math.floor((totalCentiseconds % 6000) / 100)
  const centiseconds = totalCentiseconds % 100
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(centiseconds).padStart(2, '0')}`
}

function newDeck() {
  return shuffle(generateDobbleDeck(7))
}

export default function SoloGame({ onExit }) {
  const [deck, setDeck] = useState(newDeck)
  const [pile, setPile] = useState(() => deck.slice(1))
  const [status, setStatus] = useState('ready') // ready | playing | finished
  const [elapsed, setElapsed] = useState(0)
  const [shakeCard, setShakeCard] = useState(null) // 'table' | 'draw' | null
  const startRef = useRef(null)
  const totalCards = deck.length

  useEffect(() => {
    if (status !== 'playing') return
    const id = setInterval(() => {
      setElapsed(Date.now() - startRef.current)
    }, 30)
    return () => clearInterval(id)
  }, [status])

  function start() {
    const d = newDeck()
    setDeck(d)
    setPile(d.slice(1))
    setElapsed(0)
    startRef.current = Date.now()
    setStatus('playing')
  }

  function currentTable() {
    return deck[deck.length - pile.length - 1]
  }

  function handleSymbolClick(fromCard, symbol) {
    if (status !== 'playing') return
    const table = deck[deck.length - pile.length - 1]
    const drawCard = pile[0]
    const correct = findCommonSymbol(table, drawCard)

    if (symbol !== correct) {
      setShakeCard(fromCard)
      setTimeout(() => setShakeCard(null), 300)
      return
    }

    if (pile.length === 1) {
      setElapsed(Date.now() - startRef.current)
      setStatus('finished')
      setPile([])
      return
    }

    setPile((p) => p.slice(1))
  }

  const table = status === 'ready' ? deck[0] : currentTable()
  const drawCard = pile[0]

  return (
    <div className="screen game-screen">
      <div className="game-header">
        <button className="btn btn-ghost" onClick={onExit}>← Accueil</button>
        <div className="timer">{formatTime(elapsed)}</div>
        <div className="progress">
          {totalCards - pile.length} / {totalCards}
        </div>
      </div>

      {status === 'ready' && (
        <div className="overlay">
          <p>Trouve le symbole commun entre les deux cartes le plus vite possible.</p>
          <button className="btn btn-primary" onClick={start}>Démarrer</button>
        </div>
      )}

      {status === 'finished' && (
        <div className="overlay">
          <h2>🏁 Terminé !</h2>
          <p className="final-time">{formatTime(elapsed)}</p>
          <div className="mode-buttons">
            <button className="btn btn-primary" onClick={start}>Rejouer</button>
            <button className="btn btn-ghost" onClick={onExit}>Accueil</button>
          </div>
        </div>
      )}

      {status !== 'ready' && (
        <div className="cards-row">
          <Card
            card={table}
            disabled={status !== 'playing'}
            shake={shakeCard === 'table'}
            onSymbolClick={(symbol) => handleSymbolClick('table', symbol)}
          />
          {drawCard && (
            <Card
              card={drawCard}
              disabled={status !== 'playing'}
              shake={shakeCard === 'draw'}
              onSymbolClick={(symbol) => handleSymbolClick('draw', symbol)}
            />
          )}
        </div>
      )}
    </div>
  )
}
