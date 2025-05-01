import "../Styles/Schedule.css";
import { Race_Weekend } from "../types/ScheduleTypes";
import RaceWeekendView from "./Weekend";

function FullSchedule({ list }: { list: Race_Weekend[] }) {
  return (
    <div className="flex flex-row flex-wrap gap-x-20">
      {list.length === 0 ? (
        <p>Loading...</p>
      ) : (
        list.map((weekend, index) => {
          return (
            <div
              key={index}
              className={`${weekend.IsOver ? "eventComplete" : ""}`}
            >
              <RaceWeekendView weekend={weekend} />
            </div>
          );
        })
      )}
    </div>
  );
}

export default FullSchedule;
