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
      <div className="hidden w-full flex-wrap items-center justify-between gap-2 overflow-hidden border-b border-zinc-800 p-2 px-2 md:flex mt-2">
        <div className="flex flex-wrap items-center gap2 justify-between">
          <div className="flex items-center gap-2">
            <div className="h-12 w-16">
              <img
                src="/country-flags/brn.svg"
                className="h-full w-full overflow-hidden rounded-lg"
              />
            </div>
            <div>
              <p>RaceName:Race/quali</p>
              <p>00:00:00</p>
            </div>
          </div>
          <div className="flex">
            <div>Air Temp: {data.air_temperature}</div>
            <div>Track Temp: {data.track_temperature}</div>
            <div>Humidity: {data.humidity}</div>
            <div>Rain: {data.rainfall ? "True" : "False"}</div>
            <div>Wind: {data.wind_speed}</div>
            <div>wind direction: {data.wind_direction}</div>
          </div>
        </div>
        <div className="flex w-fit flex-row items-center gap-4 ml-auto">
          <h3 className="hidden whitespace-nowrap text-3xl font-extrabold sm:block">
            lap/lap
          </h3>
          <h3> track status</h3>
        </div>
      </div>
    </>
  );
}

export default DashboardHeader;
