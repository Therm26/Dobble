import { useMemo } from 'react'
import { SYMBOLS } from '../symbols'

// PRNG déterministe (mulberry32) pour que la disposition d'une carte
// donnée reste stable tant que la carte ne change pas.
function mulberry32(seed) {
  let t = seed
  return function () {
    t |= 0
    t = (t + 0x6d2b79f5) | 0
    let r = Math.imul(t ^ (t >>> 15), 1 | t)
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296
  }
}

function hashCard(card) {
  return card.reduce((acc, symbol) => (acc * 31 + symbol + 1) | 0, 17)
}

const GOLDEN_ANGLE = 137.508

function computeLayout(card) {
  const rand = mulberry32(hashCard(card))
  const n = card.length
  return card.map((symbol, i) => {
    const angle = (i * GOLDEN_ANGLE + (rand() * 36 - 18)) * (Math.PI / 180)
    const radius = Math.sqrt((i + 1.1) / n) * 34
    const x = 50 + radius * Math.cos(angle)
    const y = 50 + radius * Math.sin(angle)
    const rotation = rand() * 360
    const scale = 0.85 + rand() * 0.25
    return { symbol, x, y, rotation, scale }
  })
}

export default function Card({ card, onSymbolClick, disabled, shake, accentColor }) {
  const layout = useMemo(() => computeLayout(card), [card])

  return (
    <div
      className={`dobble-card${shake ? ' shake' : ''}`}
      style={accentColor ? { borderColor: accentColor } : undefined}
    >
      {layout.map(({ symbol, x, y, rotation, scale }, i) => (
        <button
          key={i}
          type="button"
          className="dobble-symbol"
          disabled={disabled}
          style={{
            left: `${x}%`,
            top: `${y}%`,
            transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${scale})`,
          }}
          onClick={() => onSymbolClick?.(symbol)}
          aria-label="symbole"
        >
          {SYMBOLS[symbol]}
        </button>
      ))}
    </div>
  )
}
