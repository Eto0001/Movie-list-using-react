import { NavLink } from "react-router-dom";
import "../css/Navbar.css";

function NavBar() {
  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-brand">
        <span className="brand-icon">▶</span>
        <span className="brand-text">MovieList</span>
      </NavLink>

      <div className="navbar-links">
        <NavLink
          to="/"
          end
          className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
        >
          Home
        </NavLink>
        <NavLink
          to="/favorites"
          className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
        >
          Favorites
        </NavLink>
      </div>
    </nav>
  );
}

export default NavBar;