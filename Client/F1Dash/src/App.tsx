import { useState, useEffect } from "react";
import mainImage from "/main-logo.svg";
import Navbar from "./Components/Navbar";

function App() {
  const [, setData] = useState([]);
  useEffect(() => {
    fetch("/api/data/")
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
      <div className="center-container">
        <img
          className="centertext"
          src={mainImage}
          alt="F1 Dash logo"
          width={200}
          style={{ marginTop: "300px" }}
        />
        <h1 className="maintext centertext">
          <div>Real-time Formula 1</div>
          <div>telemetry and timing</div>
        </h1>
      </div>
      <div className="center-container">
        <div className="flex-wrap">
          <a href="/dashboard">
            <button className="centertext">Go to Dashboard</button>
          </a>
          <a href="/schedule">
            <button
              className="centertext"
              style={{
                backgroundColor: "transparent",
                border: "2px solid",
                borderColor: "darkgray",
              }}
            >
              Check Schedule
            </button>
          </a>
        </div>
      </div>
    </>
  );
}

export default App;
