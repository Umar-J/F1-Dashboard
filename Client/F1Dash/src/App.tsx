import { useState } from 'react'
import mainImage from '/main-logo.svg'
import './App.css'

function App() {
  return (
    <>
      <img src={mainImage} alt="F1 Dash logo" width={200}/>
      <h1>Real-time Formula 1<br />telemetry and timing</h1>
      <button>Go to Dashboard</button>
      <button>Check Schedule</button>
    </>
  )
}

export default App
