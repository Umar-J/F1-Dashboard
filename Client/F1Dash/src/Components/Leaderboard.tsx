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
    <div className="flex flex-col">
      {list.map((driver: Standings, index: number) => (
        <div key={index} className="leaderboardEntry">
          <span className="">
            {index + 1}. {driver.Name}
          </span>
          <span className="">{driver.Points} pts</span>
        </div>
      ))}
    </div>
  );
}

export default Leaderboard;
