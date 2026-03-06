import "../css/MovieCard.css";
import { useMovieContext } from "../context/MovieContext";
import { useState } from "react";

function RatingBadge({ rating }) {
  if (!rating) return null;
  const color =
    rating >= 7.5 ? "rating--high" :
    rating >= 5   ? "rating--mid"  :
                    "rating--low";
  return <span className={`rating-badge ${color}`}>★ {rating}</span>;
}

function MovieCard({ movie }) {
  const { addToFavorites, removeFromFavorites, isFavorite } = useMovieContext();
  const favorite = isFavorite(movie.id);
  const [bursting, setBursting] = useState(false);

  function favoriteClick(e) {
    e.preventDefault();
    if (favorite) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites(movie);
      setBursting(true);
      setTimeout(() => setBursting(false), 700);
    }
  }

  return (
    <div className="movie-card">
      <div className="movie-poster">
        <img
          src={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : "https://via.placeholder.com/500x750?text=No+Image"
          }
          alt={movie.title}
          loading="lazy"
        />

        {/* ── Hover detail panel ── */}
        <div className="movie-hover-panel">
          <div className="hover-panel-inner">
            <h4 className="hover-title">{movie.title}</h4>

            <div className="hover-meta">
              {movie.rating && (
                <span className={`hover-rating ${
                  movie.rating >= 7.5 ? "rating--high" :
                  movie.rating >= 5   ? "rating--mid"  : "rating--low"
                }`}>
                  ★ {movie.rating}
                </span>
              )}
              {movie.release_date && (
                <span className="hover-year">{movie.release_date.split("-")[0]}</span>
              )}
            </div>

            {movie.genre_names?.length > 0 && (
              <div className="hover-genres">
                {movie.genre_names.map((genre) => (
                  <span key={genre} className="hover-genre-tag">{genre}</span>
                ))}
              </div>
            )}

            {movie.overview && (
              <p className="hover-overview">{movie.overview}</p>
            )}
          </div>

          <button
            className={`favorite-btn ${favorite ? "active" : ""} ${bursting ? "burst" : ""}`}
            onClick={favoriteClick}
            aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
          >
            &#9733;
            {bursting && (
              <span className="particles" aria-hidden="true">
                {Array.from({ length: 8 }).map((_, i) => (
                  <span key={i} className="particle" style={{ "--i": i }} />
                ))}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="movie-info">
        <h3 title={movie.title}>{movie.title}</h3>
        <div className="movie-info-row">
          <p className="movie-year">{movie.release_date?.split("-")[0]}</p>
          <RatingBadge rating={movie.rating} />
        </div>
        {movie.genre_names?.length > 0 && (
          <div className="genre-tags">
            {movie.genre_names.map((genre) => (
              <span key={genre} className="genre-tag">{genre}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MovieCard;