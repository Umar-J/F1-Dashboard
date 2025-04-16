import Navbar from "../Components/Navbar";
import { useState, useEffect } from "react";
import "./Standings.css";
import { ToggleSlider } from "react-toggle-slider";
import { TeamStandings, DriverStandings } from "../Components/Leaderboard";
import Leaderboard from "../Components/Leaderboard";

function Standings() {
  const [driverLeaderboard, setDriverLeaderboard] = useState<DriverStandings[]>(
    []
  );
  const [teamLeaderboard, setTeamLeaderboard] = useState<TeamStandings[]>([]);
  const [isDriver, setIsDriver] = useState(false);

  useEffect(() => {
    fetch("/api/standings/")
      .then((response) => response.json())
      .then((data: DriverStandings[]) => {
        setDriverLeaderboard(data);
      })
      .catch((error) => {
        console.error("Error fetching standings:", error);
      });

    fetch("/api/constructor-standings/")
      .then((response) => response.json())
      .then((data: TeamStandings[]) => {
        setTeamLeaderboard(data);
      })
      .catch((error) => {
        console.error("Error fetching standings:", error);
      });
  }, []);

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center">
        <div className="flex  items-center gap-3 mt-6">
          <span>Driver</span>
          <ToggleSlider
            draggable={false}
            barWidth={60}
            onToggle={(state) => setIsDriver(state)}
          />
          <span>Constructor</span>
        </div>
        <>
          {isDriver ? (
            <Leaderboard list={teamLeaderboard} />
          ) : (
            <Leaderboard list={driverLeaderboard} />
          )}
        </>
      </div>
    </>
  );
}

export default Standings;
