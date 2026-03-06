import "./css/App.css";
import Favorites from "./pages/Favorites";
import Home from "./pages/Home";
import { Routes, Route } from "react-router-dom";
import NavBar from "./component/NavBar";
import { MovieProvider } from "./context/MovieContext";
import { createContext, useContext, useState, useEffect } from "react";

// ── Theme Context ──────────────────────────────────────────────
export const ThemeContext = createContext();
export function useTheme() { return useContext(ThemeContext); }

function App() {
  const [isDark, setIsDark] = useState(() => {
    // Persist preference across sessions
    return localStorage.getItem("theme") !== "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ isDark, setIsDark }}>
      <MovieProvider>
        <NavBar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/favorites" element={<Favorites />} />
          </Routes>
        </main>
      </MovieProvider>
    </ThemeContext.Provider>
  );
}

export default App;