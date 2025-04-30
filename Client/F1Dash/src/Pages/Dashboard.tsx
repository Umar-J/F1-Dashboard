import Navbar from "../Components/Navbar";
import DashboardHeader from "../Components/DashboardBanner";
import { Root, UpdateData } from "../types/ApiTypes";
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
      const jsonData: UpdateData[] = JSON.parse(event.data);
      // console.log("update", event.data);

      jsonData.forEach((item) => {
        const title: string = item.A[0];
        const data = item.A[1]; // Could be object or string
        const timestamp = item.A[2]; // ISO timestamp (if needed)
        console.log(title, data, timestamp);

        // if (typeof data !== "object" || data === null) {
        //   // console.log("Skipping non-object data for:", title);
        //   return;
        // }
        // switch (title) {
        //   case "WeatherData":
        //     setWeatherData((prev) => ({
        //       ...prev,
        //       ...(data as Root["WeatherData"]),
        //     }));
        //     console.log("weather Set", data);
        //     break;
        //   case "ExtrapolatedClock":
        //     setClockData((prev) => ({
        //       ...prev,
        //       ...(data as Root["ExtrapolatedClock"]),
        //     }));
        //     console.log("clock Set", data);
        //     break;
        //   case "SessionInfo":
        //     setSessionInfo((prev) => ({
        //       ...prev,
        //       ...(data as Root["SessionInfo"]),
        //     }));
        //     console.log("session Set", data);
        //     break;
        //   case "LapCount":
        //     setLapCount((prev) => ({ ...prev, ...(data as Root["LapCount"]) }));
        //     console.log("lap Set", data);
        //     break;
        //   case "TrackStatus":
        //     setTrackStatus((prev) => ({
        //       ...prev,
        //       ...(data as Root["TrackStatus"]),
        //     }));
        //     console.log("track Set", data);
        //     break;
        //   case "TimingData":
        //     // Handle TimingData updates if needed
        //     break;
        //   default:
        //     console.log("Unhandled update type:", title);
        // }
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
    </>
  );
}

export default Dashboard;
