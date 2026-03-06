import { NavLink } from "react-router-dom";
import { useTheme } from "../App";
import "../css/Navbar.css";

function NavBar() {
  const { isDark, setIsDark } = useTheme();

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

        {/* ── Theme Toggle ── */}
        <button
          className="theme-toggle"
          onClick={() => setIsDark(prev => !prev)}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          <span className="toggle-track">
            <span className="toggle-thumb" />
          </span>
          <span className="toggle-icon">{isDark ? "🌙" : "☀️"}</span>
        </button>
      </div>
    </nav>
  );
}

export default NavBar;