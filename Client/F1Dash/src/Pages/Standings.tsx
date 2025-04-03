import Navbar from "../Components/Navbar";
import { useState, useEffect } from "react";
import "./Standings.css";

interface DriverStandings {
  DriverName: string;
  Points: string;
  Team: string;
}

interface TeamStandings {
  Name: string;
  Points: string;
  Wins: string;
}

function Standings() {
  const [driverLeaderboard, setDriverLeaderboard] = useState<DriverStandings[]>(
    []
  );
  const [teamLeaderboard, setTeamLeaderboard] = useState<TeamStandings[]>([]);

  useEffect(() => {
    fetch("/api/standings/")
      .then((response) => response.json())
      .then((data: DriverStandings[]) => {
        setDriverLeaderboard(data);
      })
      .catch((error) => {
        console.error("Error fetching standings:", error);
      });
  }, []);

  useEffect(() => {
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
      <h2> Drivers: </h2>
      {driverLeaderboard.map((driver: DriverStandings, index: number) => (
        <p>
          {index + 1}. {driver.DriverName} {driver.Points}
        </p>
      ))}
      <h2> Teams: </h2>
      {teamLeaderboard.map((team: TeamStandings, index: number) => (
        <p>
          {index + 1} . {team.Name} {team.Points} {team.Wins}
        </p>
      ))}
    </>
  );
}

export default Standings;
