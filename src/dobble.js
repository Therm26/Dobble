// Génère un jeu de cartes façon Dobble à partir d'un plan projectif fini
// d'ordre n (premier). Chaque carte contient n+1 symboles, il y a
// n²+n+1 cartes et n²+n+1 symboles au total, et deux cartes quelconques
// partagent toujours exactement un symbole.
export function generateDobbleDeck(n = 7) {
  const cards = []

  // Les n+1 premières cartes : toutes partagent le symbole 0 ("le moyeu")
  for (let i = 0; i <= n; i++) {
    const card = [0]
    for (let j = 0; j < n; j++) {
      card.push(1 + n * i + j)
    }
    cards.push(card)
  }

  // Les n² cartes restantes
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const card = [i + 1]
      for (let k = 0; k < n; k++) {
        card.push(1 + n * (k + 1) + ((i * k + j) % n))
      }
      cards.push(card)
    }
  }

  return cards
}

export function symbolCount(n = 7) {
  return n * n + n + 1
}

export function shuffle(array) {
  const result = array.slice()
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

// Symbole commun entre deux cartes (il n'y en a toujours qu'un seul).
export function findCommonSymbol(cardA, cardB) {
  return cardA.find((symbol) => cardB.includes(symbol))
}
