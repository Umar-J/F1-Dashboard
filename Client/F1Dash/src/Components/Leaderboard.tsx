import "./Leaderboard.css";

export interface Standings {
  Name: string;
  Points: string;
  Wins: string;
}

export interface DriverStandings extends Standings {
  DriverName: string;
  Points: string;
  Team: string;
}

export interface TeamStandings extends Standings {
  Name: string;
  Points: string;
  Wins: string;
}

function Leaderboard({ list }: { list: Standings[] }) {
  return (
    <>
      {list.map((driver: Standings, index: number) => (
        <div className="leaderboardEntry">
          <span key={index}>
            {index + 1} {driver.Name}
          </span>
          <span className="last-child">{driver.Points} pts</span>
        </div>
      ))}
    </>
  );
}

export default Leaderboard;
