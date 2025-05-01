import "../Styles/Schedule.css";

function Countdown({ time, title }: { time: Date; title: string }) {
  return (
    <div className="countdown-container">
      <p className="header">{title}</p>
      <p className="days">{time.getUTCDate() - 1}</p>
      <p className="hours">{time.getUTCHours()}</p>
      <p className="minutes">{time.getUTCMinutes()}</p>
      <p className="seconds">{time.getUTCSeconds()}</p>
      <p className="ldays">Days</p>
      <p className="lhours">Hours</p>
      <p className="lminutes">Minutes</p>
      <p className="lseconds">Seconds</p>
    </div>
  );
}

export default Countdown;
