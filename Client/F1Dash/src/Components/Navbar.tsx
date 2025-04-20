import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <div className="topnav">
      <div className="flex flex-row flex-wrap items-center justify-start w-full h-full gap-5 px-2 select-none font-semibold text-lg py-2">
        <Link to="/">Home</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/schedule">Schedule</Link>
        <Link to="/standings">Standings</Link>
        <Link to="/settings">Settings</Link>
        <Link to="/help">Help</Link>
      </div>
    </div>
  );
}

export default Navbar;
