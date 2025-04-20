import "./Leaderboard.css";
import * as ApiTypes from "../types/ApiTypes";

function DashboardHeader({
  data,
  clock,
  sessionInfo,
  lapCount,
  trackStatus,
}: {
  data: ApiTypes.WeatherData;
  clock: ApiTypes.ExtrapolatedClock;
  sessionInfo: ApiTypes.SessionInfo;
  lapCount?: ApiTypes.LapCount | null;
  trackStatus: ApiTypes.TrackStatus;
}) {
  return (
    <div className="hidden w-full flex-wrap items-center justify-between gap-2 overflow-hidden border-b border-zinc-800 px-4 md:flex">
      <div className="flex flex-wrap items-center gap-2 justify-between">
        <div className="flex items-center gap-2">
          <div className="h-12 w-16">
            <img
              src={`/country-flags/${sessionInfo.Meeting.Country.Code}.svg`}
              className="h-full w-full overflow-hidden rounded-lg"
            />
          </div>
          <div className="flex flex-col gap-y-0 leading-none">
            <p className="my-0 font-bold">
              {`${sessionInfo.Meeting.Name}:`} {sessionInfo.Name}
            </p>
            <p className="text-2xl font-extrabold leading-none my-0 mb-0">
              {clock.Remaining}
            </p>
          </div>
        </div>
        <div className="flex gap-5">
          <div>Air: {data.AirTemp}</div>
          <div>Track: {data.TrackTemp}</div>
          <div>Humidity: {data.Humidity} %</div>
          <div>Rain: {data.Rainfall ? "True" : "False"}</div>
          <div>WindSpeed: {data.WindSpeed}</div>
          <div>wind: {data.WindDirection}</div>
        </div>
      </div>
      <div className="flex w-fit flex-row items-center gap-4 ml-auto">
        {lapCount && (
          <h3 className="hidden whitespace-nowrap text-3xl font-extrabold sm:block leading-none mb-0 my-0">
            {`${lapCount.CurrentLap} / ${lapCount.TotalLaps}`}
          </h3>
        )}
        <h3
          className={
            getTrackStatusColor(trackStatus.Status) +
            " flex h-8 items-center truncate rounded-md px-2"
          }
        >
          {getTrackStatusText(trackStatus.Status)}
        </h3>
      </div>
    </div>
  );
}

function getTrackStatusColor(status: string): string {
  switch (status) {
    case "1":
      return "bg-emerald-500";
    case "2":
      return "bg-yellow-500";
    case "3":
      return " bg-gray-500";
    case "5":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
}

function getTrackStatusText(status: string): string {
  switch (status) {
    case "1":
      return "Track Clear";
    case "2":
      return "Yellow";
    case "3":
      return "gray";
    case "5":
      return "Red Flag";
    default:
      return "Unknown";
  }
}

export default DashboardHeader;
