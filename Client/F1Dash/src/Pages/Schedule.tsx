
import Navbar from "../Components/Navbar"
import {useState, useEffect} from 'react'
import './Schedule.css'

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
              <p className="friday-header">Friday</p>
              <p className="saturday-header">Saturday</p>
              <p className="sunday-header">Sunday</p>
              <p className="e1name">{weekend.Events[0].Name}</p>
              <p className="e1time">
                {new Date(weekend.Events[0].Start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) + " - "}
                {new Date(weekend.Events[0].End).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </p>
              <p className="e2name">{weekend.Events[1].Name}</p>
              <p className="e2time">
                {new Date(weekend.Events[1].Start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) + " - "}
                {new Date(weekend.Events[1].End).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </p>
              <p className="e3name">{weekend.Events[2].Name}</p>
              <p className="e3time">
                {new Date(weekend.Events[2].Start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) + " - "}
                {new Date(weekend.Events[2].End).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </p>
              <p className="e4name">{weekend.Events[3].Name}</p>
              <p className="e4time">
                {new Date(weekend.Events[3].Start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) + " - "}
                {new Date(weekend.Events[3].End).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </p>
              <p className="e5name">{weekend.Events[4]?.Name}</p>
              <p className="e5time">
                {new Date(weekend.Events[4]?.Start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) + " - "}
                {new Date(weekend.Events[4]?.End).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </p>
              
            </div>
              
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default Schedule
