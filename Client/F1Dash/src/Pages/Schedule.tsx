import Navbar from "../Components/Navbar"
import {useState, useEffect} from 'react'
import './Schedule.css'
import React from "react";

export interface Race_Weekend {
  Country: string;
  Events:  Event[];
  IsOver: boolean;
}

export interface Event {
  Name:  string;
  Start: Date;
  End:   Date;
}

function Schedule() {
  
  const [raceWeekends, setRaceWeekends] = useState<Race_Weekend[]>([]);

  useEffect(() => {
     fetch('/api/schedule')
        .then((response) => response.json())
        .then((data: Race_Weekend[]) => {
           setRaceWeekends(data);
        })
        .catch((err) => {
           console.log(err.message);
        });
  }, []);

  const nextRaceTime = new Date ((raceWeekends.find((weekend)=> weekend.IsOver === false))?.Events.find((event) => event.Name.match("Race"))?.Start || 0);
  const timeRemaining = new Date (nextRaceTime ? nextRaceTime.getTime() - Date.now() : 0); 
  // why cant call that settime here?

  const [timeRemainingS, setTimeRemainingS] = useState(timeRemaining);

  const nextSessionTime = new Date((raceWeekends.find((weekend) => weekend.IsOver === false)?.Events.find((event) => new Date(event.Start).getTime() > Date.now())?.Start || 0));
  
  const [nextSessionTimeS, setNextSessionTimeS] = useState(nextSessionTime);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemainingS(new Date(nextRaceTime.getTime() - Date.now()));
      setNextSessionTimeS(new Date(nextSessionTime.getTime() - Date.now()))
    }, 1000);
    return () => clearInterval(interval);
  }, [timeRemainingS]);
  
  return (
    <>
    <style>
    </style>
      <Navbar />
      <h1 className="text-3xl" style = {{marginTop : 50}} >Up Next</h1>
      <p className="text-zinc-600">All times are local</p>
      <div className = "countdown-container" style = {{maxWidth:'350px'}}>
        <p className="header">Next Session in</p>
        <p className="days">{nextSessionTimeS.getDate()}</p>
        <p className="hours">{nextSessionTimeS.getHours()}</p>
        <p className="minutes">{nextSessionTimeS.getMinutes()}</p>
        <p className="seconds">{nextSessionTimeS.getSeconds()}</p>
        <p className="ldays">Days</p>
        <p className="lhours">Hours</p>
        <p className="lminutes">Minutes</p>
        <p className="lseconds">Seconds</p>
      </div>

      <div className = "countdown-container" style = {{maxWidth:'350px'}}>
        <p className="header">Next race in</p>
        <p className="days">{timeRemainingS.getDate()}</p>
        <p className="hours">{timeRemainingS.getHours()}</p>
        <p className="minutes">{timeRemainingS.getMinutes()}</p>
        <p className="seconds">{timeRemainingS.getSeconds()}</p>
        <p className="ldays">Days</p>
        <p className="lhours">Hours</p>
        <p className="lminutes">Minutes</p>
        <p className="lseconds">Seconds</p>
      </div>
      <div>
        {raceWeekends.length === 0 ? (
          <p>Loading...</p>
        ) : (
          raceWeekends.map((weekend, index) => (
            <div key={index}>
              <div className="country-container" style={{maxWidth: '500px'}}>
                <h2 className="text-2xl item1country">{weekend.Country}</h2>
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
          ))
        )}
      </div>
    </>
  );
}

export default Schedule
