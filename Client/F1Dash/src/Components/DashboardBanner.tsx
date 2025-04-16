import "./Leaderboard.css";

export interface Weather_Info {
  track_temperature: Float32Array;
  air_temperature: Float32Array;
  humidity: Float32Array;
  rainfall: Int8Array;
  wind_speed: Int8Array;
  wind_direction: Int8Array;
}

function DashboardHeader({ data }: { data: Weather_Info }) {
  return (
    <>
      <div>
        <p>flag</p>
        <p>RaceName:Race/quali</p>
        <p>00:00:00</p>
        <div>Air Temp: {data.air_temperature}</div>
        <div>Track Temp: {data.track_temperature}</div>
        <div>Humidity: {data.humidity}</div>
        <div>Rain: {data.rainfall ? "True" : "False"}</div>
        <div>Wind: {data.wind_speed}</div>
        <div>wind direction: {data.wind_direction}</div>
        <h3>lap/lap</h3>
        <h3> track status</h3>
        <hr style={{ width: "1920", textAlign: "left", marginLeft: "0px" }} />
      </div>
    </>
  );
}

export default DashboardHeader;
