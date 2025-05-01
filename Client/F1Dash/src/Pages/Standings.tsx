import Navbar from "../Components/Navbar";
import { useState, useEffect } from "react";
import "./Standings.css";
import { TeamStandings, DriverStandings } from "../Components/Leaderboard";
import Leaderboard from "../Components/Leaderboard";
import DriverConstructorSwitcher from "../Components/Switcher";

function Standings() {
  const [driverLeaderboard, setDriverLeaderboard] = useState<DriverStandings[]>(
    [],
  );
  const [teamLeaderboard, setTeamLeaderboard] = useState<TeamStandings[]>([]);
  const [isDriver, setIsDriver] = useState(true);

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
        <>
          <div className="mt-4">
            <DriverConstructorSwitcher
              onToggle={(state) => setIsDriver(state)}
            />
          </div>

          {isDriver ? (
            <Leaderboard list={driverLeaderboard} />
          ) : (
            <Leaderboard list={teamLeaderboard} />
          )}
        </>
      </div>
    </>
  );
}

export default Standings;
