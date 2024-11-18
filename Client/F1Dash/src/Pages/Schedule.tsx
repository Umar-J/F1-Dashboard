
import Navbar from "../Components/Navbar"
import {useState, useEffect} from 'react'

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
      <Navbar />
      <h1 className="text-3xl">Up Next</h1>
      <p className="text-zinc-600">All times are local</p>
      <div>
        {raceWeekends.length === 0 ? (
          <p>Loading...</p>
        ) : (
          raceWeekends.map((weekend, index) => (
            <div key={index}>
              <h2 className="text-2xl">{weekend.Country}</h2>
              {weekend.Events.map((event, eventIndex) => (
                <div key={eventIndex}>
                  <p>Name: {event.Name}</p>
                  <p>
                    {/* need to implement way to use locale of user */}
                    Start: {new Date(event.Start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - End: {new Date(event.End).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default Schedule
