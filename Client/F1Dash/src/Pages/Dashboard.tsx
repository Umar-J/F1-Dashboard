import Navbar from "../Components/Navbar";
import DashboardHeader from "../Components/DashboardBanner";
import { Root } from "../types/ApiTypes";
import { useState, useEffect } from "react";

function Dashboard() {
  const [weatherData, setWeatherData] = useState<Root["WeatherData"] | null>();
  const [clockData, setClockData] = useState<
    Root["ExtrapolatedClock"] | null
  >();
  const [sessionInfo, setSessionInfo] = useState<Root["SessionInfo"] | null>();
  const [lapCount, setLapCount] = useState<Root["LapCount"] | null>();
  const [trackStatus, setTrackStatus] = useState<Root["TrackStatus"] | null>();

  useEffect(() => {
    const eventSource = new EventSource("/api/dashboard/");
    eventSource.addEventListener("new", (event) => {
      const jsonData: Root = JSON.parse(event.data);
      setWeatherData(jsonData.WeatherData);
      setClockData(jsonData.ExtrapolatedClock);
      setSessionInfo(jsonData.SessionInfo);
      setLapCount(jsonData.LapCount);
      setTrackStatus(jsonData.TrackStatus);
    });

    eventSource.addEventListener("update", (event) => {
      console.log(event.data);
    });

    eventSource.onerror = (err) => {
      console.error("EventSource failed:", err);
      eventSource.close();
    };

    return () => {
      console.log("Closing EventSource");
      eventSource.close();
    };
  }, []);

  return (
    <>
      <Navbar />
      <div style={{ display: "flex", gap: "2rem" }}>
        {/* use handdrawn template */}
        {weatherData && clockData && sessionInfo && lapCount && trackStatus ? (
          <DashboardHeader
            data={weatherData}
            clock={clockData}
            sessionInfo={sessionInfo}
            lapCount={lapCount}
            trackStatus={trackStatus}
          />
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </>
  );
}

export default Dashboard;
