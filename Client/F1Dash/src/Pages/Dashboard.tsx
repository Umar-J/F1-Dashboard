import Navbar from "../Components/Navbar";
import DashboardHeader from "../Components/DashboardBanner";
import { Weather_Info } from "../Components/DashboardBanner";
import { useState, useEffect } from "react";

function Dashboard() {
  const [data, setData] = useState<Weather_Info | null>(null);

  useEffect(() => {
    const eventSource = new EventSource("/api/dashboard/");
    eventSource.addEventListener("new", (event) => {
      console.log(event.data);
      try {
        const parsedData: Weather_Info = JSON.parse(event.data);
        setData(parsedData);
      } catch (error) {
        console.error("Failed to parse JSON:", error);
      }
    });

    eventSource.addEventListener("update", (event) => {
      console.log(event.data);
      try {
        const parsedData: Weather_Info = JSON.parse(event.data);
        setData(parsedData);
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
      <div style={{ display: "flex", gap: "2rem" }}>
        {/* use handdrawn template */}
        {data ? (
          <>
            <DashboardHeader data={data} />
          </>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </>
  );
}

export default Dashboard;
