import { useState, useEffect } from 'react'
import mainImage from '/main-logo.svg'
import './App.css'
import { Link } from 'react-router-dom';

function App() {
  const [data, setData] = useState([]);
  useEffect(() => {
     fetch('/api/data')
        .then((response) => response.json())
        .then((data) => {
           console.log(data);
           setData(data);
        })
        .catch((err) => {
           console.log(err.message);
        });
  }, []);

  return (
    <>
      <div className="topnav">
        <Link to="/">Home</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/schedule">Schedule</Link>
        <Link to="/settings">Settings</Link>
        <Link to="/help">Help</Link>
      </div>
      <img src={mainImage} alt="F1 Dash logo" width={200}/>
      <h1>Real-time Formula 1<br />telemetry and timing</h1>
      <button>Go to Dashboard</button>
      <button>Check Schedule<Link to="/schedule"/></button>
    </>
  )
}

export default App
