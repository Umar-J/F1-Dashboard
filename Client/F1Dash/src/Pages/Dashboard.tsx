import Navbar from "../Components/Navbar";
import { useState, useEffect } from 'react';

export interface Weather_Info {
  track_temperature: Float32Array;
  air_temperature: Float32Array;
  humidity: Float32Array;
  rainfall: Int8Array;
  wind_speed: Int8Array;
  wind_direction: Int8Array;
} 

function Dashboard() {
  const [data, setData] = useState<Weather_Info | null>(null);

  useEffect(() => {
    console.log("Creating new EventSource");
    const eventSource = new EventSource('/api/dashboard');
    eventSource.addEventListener('weather', (event) => {
      console.log("Weather event received", event.data);
      try {
        const parsedData: Weather_Info = JSON.parse(event.data);
        setData(parsedData);
        console.log(data?.air_temperature)
      } catch (error) {
        console.error("Failed to parse JSON:", error);
      }
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
      <h1>Dashboard</h1>
      <div>
        {/* use handdrawn template */}
        {data ? (
          <>
            <div>Air Temp: {data.air_temperature}</div>
            <div>Track Temp: {data.track_temperature}</div>
            <div>Humidity: {data.humidity}</div>
            <div>Rain: {data.rainfall ? "True" : "False"}</div>
            <div>Wind: {data.wind_speed}</div>
            <div>wind_direction: {data.wind_direction}</div>
          </>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </>
  );
}

export default Dashboard;