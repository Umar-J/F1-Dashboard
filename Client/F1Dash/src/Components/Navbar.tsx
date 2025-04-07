import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <div className="topnav">
      <Link to="/">Home</Link>
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/schedule">Schedule</Link>
      <Link to="/standings">Standings</Link>
      <Link to="/settings">Settings</Link>
      <Link to="/help">Help</Link>
    </div>
  );
}

export default Navbar;
