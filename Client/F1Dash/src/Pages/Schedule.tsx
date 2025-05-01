import Navbar from "../Components/Navbar";
import { useState, useEffect } from "react";
import { Race_Weekend } from "../types/ScheduleTypes";
import FullSchedule from "../Components/WeekendList";
import RaceWeekendView from "../Components/Weekend";
import Countdown from "../Components/Countdown";

function Schedule() {
  const [raceWeekends, setRaceWeekends] = useState<Race_Weekend[]>([]);

  const [nextRaceTime, setNextRaceTime] = useState<Date>(new Date(0));
  const [nextRaceTimeRemaining, setNextRaceTimeRemaining] = useState<Date>(
    new Date(0),
  );

  const [nextSessionTime, setNextSessionTime] = useState<Date>(new Date(0));
  const [nextSessionTimeRemaining, setNextSessionTimeRemaining] =
    useState<Date>(new Date(0));

  const upcomingWeekend = raceWeekends.find((x) => x.IsOver === false);

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
          ?.Events.find((event) => event.Name.match("Race"))?.Start || 0,
      ),
    );
    setNextRaceTimeRemaining(new Date(nextRaceTime.getTime() - Date.now()));
    setNextSessionTime(
      new Date(
        raceWeekends
          .find((weekend) => weekend.IsOver === false)
          ?.Events.find((event) => new Date(event.Start).getTime() > Date.now())
          ?.Start || 0,
      ),
    );
    setNextSessionTimeRemaining(
      new Date(nextSessionTime.getTime() - Date.now()),
    );
  }, [raceWeekends]);

  useEffect(() => {
    const interval = setInterval(() => {
      setNextRaceTimeRemaining(new Date(nextRaceTime.getTime() - Date.now()));
      setNextSessionTimeRemaining(
        new Date(nextSessionTime.getTime() - Date.now()),
      );
    }, 1000);
    return () => clearInterval(interval);
  }, [nextRaceTimeRemaining, nextSessionTimeRemaining]);

  return (
    <>
      <Navbar />
      <div className="container mx-auto">
        <div className="flex flex-col space-y-0 my-4">
          <h1>Up Next</h1>
          <p className="text-zinc-600 m-0">All times are local time</p>
        </div>
        <div className="grid grid-cols-[1.05fr_2fr] gap-x-20">
          <div className="min-w-4 overflow-auto">
            <Countdown
              time={nextSessionTimeRemaining}
              title="Next Session in"
            />
            <Countdown time={nextRaceTimeRemaining} title="Next race in" />
          </div>
          <div className="flex flex-col flex-wrap">
            {upcomingWeekend ? (
              <RaceWeekendView weekend={upcomingWeekend} />
            ) : null}
          </div>
        </div>
        <div className="flex flex-col space-y-0">
          <h1>Schedule</h1>
          <p className="text-zinc-600 m-0">All times are local time</p>
        </div>
        <FullSchedule list={raceWeekends} />
      </div>
    </>
  );
}

export default Schedule;
