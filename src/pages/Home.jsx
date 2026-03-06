import MovieCard from "../component/MovieCard";
import { useState, useEffect, useCallback } from "react";
import { searchMovies, getPopularMovies } from "../services/api";
import "../css/Home.css";

function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const loadPopularMovies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const popularMovies = await getPopularMovies();
      setMovies(popularMovies);
    } catch (err) {
      console.error("Error loading popular movies:", err);
      setError("Failed to load popular movies. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPopularMovies();
  }, [loadPopularMovies]);

  const handleSearch = async (e) => {
    e.preventDefault();
    const trimmed = searchTerm.trim();
    if (!trimmed) return;

    setLoading(true);
    setError(null);
    setIsSearching(true);

    try {
      const searchResults = await searchMovies(trimmed);
      setMovies(searchResults);
    } catch (err) {
      console.error("Search error:", err);
      setError("Failed to search movies. Please try again later.");
    } finally {
      setLoading(false);
      setSearchTerm("");
    }
  };

  const handleClearSearch = () => {
    setIsSearching(false);
    setSearchTerm("");
    loadPopularMovies();
  };

  return (
    <div className="home">

      {/* Search */}
      <form onSubmit={handleSearch} className="search-form" noValidate>
        <input
          type="text"
          placeholder="Search for a movie..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search movies"
        />
        <button
          type="submit"
          className="search-button"
          disabled={loading || !searchTerm.trim()}
        >
          {loading ? <span className="btn-spinner" /> : "Search"}
        </button>
      </form>

      
      <header className="home-header">
        <h1 className="home-title">
          {isSearching ? "Search Results" : "Popular Right Now"}
        </h1>
        {isSearching && (
          <button className="clear-search-btn" onClick={handleClearSearch}>
            ← Back to Popular
          </button>
        )}
      </header>

      {/* Error */}
      {error && (
        <div className="error-message" role="alert">
          <span className="error-icon">⚠</span>
          {error}
          <button className="error-retry" onClick={loadPopularMovies}>
            Retry
          </button>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="loading-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton-card" style={{ animationDelay: `${i * 0.07}s` }} />
          ))}
        </div>
      ) : movies.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🎬</span>
          <p>No movies found. Try a different search.</p>
        </div>
      ) : (
        <div className="movies-grid">
          {movies.map((movie, i) => (
            <div
              key={movie.id}
              className="movie-card-wrapper"
              style={{ animationDelay: `${i * 0.04}s` }}
            >
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;