import Navbar from "../Components/Navbar";
import DashboardHeader from "../Components/DashboardBanner";
import { Root } from "../types/DashboardTypes";
import { useState, useEffect } from "react";

function Dashboard() {
  const [weatherData, setWeatherData] = useState<Root["WeatherData"] | null>();
  const [clockData, setClockData] = useState<
    Root["ExtrapolatedClock"] | null
  >();
  const [sessionInfo, setSessionInfo] = useState<Root["SessionInfo"] | null>();
  const [lapCount, setLapCount] = useState<Root["LapCount"] | null>();
  const [trackStatus, setTrackStatus] = useState<Root["TrackStatus"] | null>();
  const [raceControlMessages, setRaceControlMessages] = useState<
    Root["RaceControlMessages"] | null
  >();

  useEffect(() => {
    const eventSource = new EventSource("/api/dashboard/");
    eventSource.addEventListener("new", (event) => {
      const jsonData: Root = JSON.parse(event.data);
      console.log(jsonData);
      setWeatherData(jsonData.WeatherData);
      setClockData(jsonData.ExtrapolatedClock);
      setSessionInfo(jsonData.SessionInfo);
      setLapCount(jsonData.LapCount);
      setTrackStatus(jsonData.TrackStatus);
      setRaceControlMessages(jsonData.RaceControlMessages);
    });

    eventSource.addEventListener("update", (event) => {
      const jsonData = JSON.parse(event.data);
      jsonData.map((item: any) => {
        const jsonItem = JSON.stringify(item.A);
        console.log(jsonItem);
      });
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
        {weatherData && clockData && sessionInfo && trackStatus ? (
          <DashboardHeader
            data={weatherData}
            clock={clockData}
            sessionInfo={sessionInfo}
            lapCount={lapCount}
            trackStatus={trackStatus}
          />
        ) : (
          <div className="my-15">Loading...</div>
        )}
      </div>
      <div className="h-64 overflow-y-auto border border-gray-300 p-4 rounded-2xl my-2">
        <div>
          {raceControlMessages ? (
            <>
              {raceControlMessages.Messages.slice()
                .reverse()
                .map((message) => (
                  <p>{message.Message}</p>
                ))}
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  );
}

export default Dashboard;
