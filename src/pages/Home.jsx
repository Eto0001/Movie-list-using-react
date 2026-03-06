import MovieCard from "../component/MovieCard";
import { useState, useEffect, useCallback } from "react";
import { searchMovies, getPopularMovies } from "../services/api";
import "../css/Home.css";

function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const fetchMovies = useCallback(async (pageNum, query = "") => {
    setLoading(true);
    setError(null);
    try {
      const { movies: newMovies, totalPages: tp } = query
        ? await searchMovies(query, pageNum)
        : await getPopularMovies(pageNum);
      setMovies(newMovies);
      setTotalPages(Math.min(tp, 500)); // TMDB caps at 500
      setPage(pageNum);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
      setError("Failed to load movies. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMovies(1);
  }, [fetchMovies]);

  const handleSearch = async (e) => {
    e.preventDefault();
    const trimmed = searchTerm.trim();
    if (!trimmed) return;
    setIsSearching(true);
    setActiveQuery(trimmed);
    setSearchTerm("");
    fetchMovies(1, trimmed);
  };

  const handleClearSearch = () => {
    setIsSearching(false);
    setActiveQuery("");
    setSearchTerm("");
    fetchMovies(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage === page || newPage < 1 || newPage > totalPages) return;
    fetchMovies(newPage, activeQuery);
  };

  // Build the page number list with ellipsis
  const getPageNumbers = () => {
    const delta = 2; // pages around current
    const pages = [];

    const left = Math.max(2, page - delta);
    const right = Math.min(totalPages - 1, page + delta);

    pages.push(1);
    if (left > 2) pages.push("...");
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < totalPages - 1) pages.push("...");
    if (totalPages > 1) pages.push(totalPages);

    return pages;
  };

  return (
    <div className="home">
      <header className="home-header">
        <h1 className="home-title">
          {isSearching ? `Results for "${activeQuery}"` : "Popular Right Now"}
        </h1>
        {isSearching && (
          <button className="clear-search-btn" onClick={handleClearSearch}>
            ← Back to Popular
          </button>
        )}
      </header>

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

      {error && (
        <div className="error-message" role="alert">
          <span className="error-icon">⚠</span>
          {error}
          <button className="error-retry" onClick={() => fetchMovies(page, activeQuery)}>
            Retry
          </button>
        </div>
      )}

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
        <>
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

          {totalPages > 1 && (
            <nav className="pagination" aria-label="Page navigation">
              {/* Prev */}
              <button
                className="page-btn page-arrow"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                aria-label="Previous page"
              >
                ‹
              </button>

              {/* Page numbers */}
              {getPageNumbers().map((p, i) =>
                p === "..." ? (
                  <span key={`ellipsis-${i}`} className="page-ellipsis">…</span>
                ) : (
                  <button
                    key={p}
                    className={`page-btn${p === page ? " active" : ""}`}
                    onClick={() => handlePageChange(p)}
                    aria-label={`Page ${p}`}
                    aria-current={p === page ? "page" : undefined}
                  >
                    {p}
                  </button>
                )
              )}

              {/* Next */}
              <button
                className="page-btn page-arrow"
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                aria-label="Next page"
              >
                ›
              </button>
            </nav>
          )}
        </>
      )}
    </div>
  );
}

export default Home;