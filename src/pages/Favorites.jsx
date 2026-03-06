import "../css/Favorites.css";
import { useMovieContext } from "../context/MovieContext";
import MovieCard from "../component/MovieCard";
import { Link } from "react-router-dom";

function Favorites() {
  const { favorites } = useMovieContext();

  if (!favorites?.length) {
    return (
      <div className="favorites-empty">
        <div className="empty-icon">★</div>
        <h2>No favorites yet</h2>
        <p>Add movies to your list and they'll show up here.</p>
        <Link to="/" className="empty-cta">Browse Movies</Link>
      </div>
    );
  }

  return (
    <div className="favorites">
      <header className="favorites-header">
        <h2 className="favorites-title">Your Favorites</h2>
        <span className="favorites-count">{favorites.length} {favorites.length === 1 ? "movie" : "movies"}</span>
      </header>

      <div className="movies-grid">
        {favorites.map((movie, i) => (
          <div
            key={movie.id}
            className="movie-card-wrapper"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Favorites;