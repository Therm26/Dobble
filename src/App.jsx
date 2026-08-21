import { useState } from 'react'
import Home from './components/Home'
import SoloGame from './components/SoloGame'
import MultiplayerSetup from './components/MultiplayerSetup'
import MultiplayerGame from './components/MultiplayerGame'
import './App.css'

export default function App() {
  const [screen, setScreen] = useState('home')
  const [players, setPlayers] = useState([])

  function goHome() {
    setScreen('home')
  }

  return (
    <div className="app">
      {screen === 'home' && <Home onSelectMode={setScreen} />}

      {screen === 'solo' && <SoloGame onExit={goHome} />}

      {screen === 'multi-setup' && (
        <MultiplayerSetup
          onExit={goHome}
          onStart={(names) => {
            setPlayers(names)
            setScreen('multi-game')
          }}
        />
      )}

      {screen === 'multi-game' && (
        <MultiplayerGame players={players} onExit={goHome} />
      )}
    </div>
  )
}
