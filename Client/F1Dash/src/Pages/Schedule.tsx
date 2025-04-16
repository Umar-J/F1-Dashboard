import Navbar from "../Components/Navbar";
import { useState, useEffect } from "react";
import "./Schedule.css";

export interface Race_Weekend {
  Country: string;
  Events: Event[];
  IsOver: boolean;
}

export interface Event {
  Name: string;
  Start: Date;
  End: Date;
}

function Schedule() {
  const [raceWeekends, setRaceWeekends] = useState<Race_Weekend[]>([]);

  const [nextRaceTime, setNextRaceTime] = useState<Date>(new Date(0));
  const [nextRaceTimeRemaining, setNextRaceTimeRemaining] = useState<Date>(
    new Date(0)
  );

  const [nextSessionTime, setNextSessionTime] = useState<Date>(new Date(0));
  const [nextSessionTimeRemaining, setNextSessionTimeRemaining] =
    useState<Date>(new Date(0));

  useEffect(() => {
    fetch("/api/schedule/")
      .then((response) => response.json())
      .then((data: Race_Weekend[]) => {
        // TODO: Parse the date objects
        setRaceWeekends(data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  useEffect(() => {
    setNextRaceTime(
      new Date(
        raceWeekends
          .find((weekend) => weekend.IsOver === false)
          ?.Events.find((event) => event.Name.match("Race"))?.Start || 0
      )
    );
    setNextRaceTimeRemaining(new Date(nextRaceTime.getTime() - Date.now()));
    setNextSessionTime(
      new Date(
        raceWeekends
          .find((weekend) => weekend.IsOver === false)
          ?.Events.find((event) => new Date(event.Start).getTime() > Date.now())
          ?.Start || 0
      )
    );
    setNextSessionTimeRemaining(
      new Date(nextSessionTime.getTime() - Date.now())
    );
  }, [raceWeekends]);

  useEffect(() => {
    const interval = setInterval(() => {
      setNextRaceTimeRemaining(new Date(nextRaceTime.getTime() - Date.now()));
      setNextSessionTimeRemaining(
        new Date(nextSessionTime.getTime() - Date.now())
      );
    }, 1000);
    return () => clearInterval(interval);
  }, [nextRaceTimeRemaining, nextSessionTimeRemaining]);

  return (
    <>
      <Navbar />
      {/* TODO: on display shrink, make them width of 1*/}
      <h1 className="text-3xl">Up Next</h1>
      <p className="text-zinc-600 left">All times are local</p>
      <div className="countdown-container">
        <p className="header">Next Session in</p>
        <p className="days">{nextSessionTimeRemaining.getUTCDate() - 1}</p>
        <p className="hours">{nextSessionTimeRemaining.getUTCHours()}</p>
        <p className="minutes">{nextSessionTimeRemaining.getUTCMinutes()}</p>
        <p className="seconds">{nextSessionTimeRemaining.getUTCSeconds()}</p>
        <p className="ldays">Days</p>
        <p className="lhours">Hours</p>
        <p className="lminutes">Minutes</p>
        <p className="lseconds">Seconds</p>
      </div>

      <div className="countdown-container">
        <p className="header">Next race in</p>
        <p className="days">{nextRaceTimeRemaining.getUTCDate() - 1}</p>
        <p className="hours">{nextRaceTimeRemaining.getUTCHours()}</p>
        <p className="minutes">{nextRaceTimeRemaining.getUTCMinutes()}</p>
        <p className="seconds">{nextRaceTimeRemaining.getUTCSeconds()}</p>
        <p className="ldays">Days</p>
        <p className="lhours">Hours</p>
        <p className="lminutes">Minutes</p>
        <p className="lseconds">Seconds</p>
      </div>
      <div className="twoWide-container">
        {raceWeekends.length === 0 ? (
          <p>Loading...</p>
        ) : (
          raceWeekends.map((weekend, index) => {
            const currentEventStatus = <p className="weekendStatus">{weekend.IsOver ? 'Over' : ''}</p>;
            return (
              <div key={index} className={`${weekend.IsOver ? 'eventComplete' : ''}`}>
                <div className="country-container" style={{maxWidth: '500px'}}>
                  <h2 className="text-2xl item1country">{weekend.Country}</h2>
                  <h3>{currentEventStatus}</h3>
                  <h2 className="text-2xl item2country">
                    {new Date(weekend.Events[0].Start).toLocaleDateString('en-US', {month: 'long'}) + " "} 
                  </h2>
                  <p className="item3country">
                    {`${new Date(weekend.Events[0].Start).getDate()}-`}
                    {new Date(weekend.Events[weekend.Events.length - 1].Start).getDate()}
                  </p>
                </div>
                <hr style={{width: '500px', textAlign: 'left', marginLeft: 0}}/>
                <div className="weekend-container" style = {{maxWidth:'500px'}}>
                <p className="friday-header" style = {{fontSize:'1.5rem', lineHeight:'0.5rem', fontWeight:'bold'}}>
                  {new Date(weekend.Events[0].Start).toLocaleDateString('en-US', { weekday: 'long' })}
                </p>
                <p className="saturday-header">
                  {new Date(weekend.Events[2].Start).toLocaleDateString('en-US', { weekday: 'long' })}
                </p>
                <p className="sunday-header">
                  {new Date(weekend.Events[weekend.Events.length - 1]?.Start).toLocaleDateString('en-US', { weekday: 'long' })}
                </p>
                {weekend.Events.map((event, eventIndex) => (
                  <>
                    <p className={`e${eventIndex + 1}name`}>{event.Name}</p>
                    <p className={`e${eventIndex + 1}time`}>
                      {new Date(event.Start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + " - "}
                      {new Date(event.End).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </>
                ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}

export default Schedule;
