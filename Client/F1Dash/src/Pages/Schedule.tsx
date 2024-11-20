import Navbar from "../Components/Navbar"
import {useState, useEffect} from 'react'
import './Schedule.css'
import React from "react";

export interface Race_Weekend {
  Country: string;
  Events:  Event[];
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
           console.log(data);
           setRaceWeekends(data);
        })
        .catch((err) => {
           console.log(err.message);
        });
  }, []);
  

  return (
    <>
    <style>
    </style>
      <Navbar />
      <h1 className="text-3xl" style = {{marginTop : 50}} >Up Next</h1>
      <p className="text-zinc-600">All times are local</p>
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
              <p className="friday-header" style = {{fontSize:'1.5rem', lineHeight:'0.5rem', fontWeight:'bold'}}>Friday</p>
              <p className="saturday-header">Saturday</p>
              <p className="sunday-header">Sunday</p>
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
