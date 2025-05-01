import React from "react";
import "../Styles/Schedule.css";
import { Race_Weekend } from "../types/ScheduleTypes";

function RaceWeekendView({ weekend }: { weekend: Race_Weekend }) {
  const currentEventStatus = (
    <p className="weekendStatus">{weekend.IsOver ? "Over" : ""}</p>
  );

  return (
    <>
      {/* Country and Date Information */}
      <div className="country-container" style={{ maxWidth: "500px" }}>
        <h2 className="text-2xl item1country">{weekend.Country}</h2>
        <h3>{currentEventStatus}</h3>
        <h2 className="text-2xl item2country">
          {new Date(weekend.Events[0].Start).toLocaleDateString("en-US", {
            month: "long",
          }) + " "}
        </h2>
        <p className="item3country">
          {`${new Date(weekend.Events[0].Start).getDate()}-`}
          {new Date(weekend.Events[weekend.Events.length - 1].Start).getDate()}
        </p>
      </div>

      <hr style={{ width: "500px", textAlign: "left", marginLeft: 0 }} />

      {/* Event Details */}
      <div className="weekend-container" style={{ maxWidth: "500px" }}>
        <p
          className="friday-header"
          style={{
            fontSize: "1.5rem",
            lineHeight: "0.5rem",
            fontWeight: "bold",
          }}
        >
          {new Date(weekend.Events[0].Start).toLocaleDateString("en-US", {
            weekday: "long",
          })}
        </p>
        <p className="saturday-header">
          {new Date(weekend.Events[2].Start).toLocaleDateString("en-US", {
            weekday: "long",
          })}
        </p>
        <p className="sunday-header">
          {new Date(
            weekend.Events[weekend.Events.length - 1]?.Start,
          ).toLocaleDateString("en-US", { weekday: "long" })}
        </p>
        {weekend.Events.map((event, eventIndex) => (
          <React.Fragment key={eventIndex}>
            <p className={`e${eventIndex + 1}name`}>{event.Name}</p>
            <p className={`e${eventIndex + 1}time`}>
              {new Date(event.Start).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }) + " - "}
              {new Date(event.End).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </React.Fragment>
        ))}
      </div>
    </>
  );
}

export default RaceWeekendView;
