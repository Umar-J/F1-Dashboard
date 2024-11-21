import { useState, useEffect } from 'react'
import mainImage from '/main-logo.svg'
import './App.css'
import { Link } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Schedule from './Pages/Schedule';

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
      <Navbar />
      <div className='center-container'>
        <img className='centertext' src={mainImage} alt="F1 Dash logo" width={200} style = {{marginTop:'400px'}}/>
        <h1 className='maintext centertext'>Real-time Formula 1<br/>telemetry and timing</h1>
      </div>
      <div className='center-container'>
        <div className='flex-wrap'>
          <button className='centertext'>Go to Dashboard</button>
          <button className='centertext'>Check Schedule</button>
        </div>
      </div>
    </>
  )
}

export default App
