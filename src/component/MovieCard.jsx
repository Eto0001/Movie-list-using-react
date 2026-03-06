import "../css/MovieCard.css";
import { useMovieContext } from "../context/MovieContext";
import { useState } from "react";

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
        />
        <div className="movie-overlay">
          <button
            className={`favorite-btn ${favorite ? "active" : ""} ${bursting ? "burst" : ""}`}
            onClick={favoriteClick}
            aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
          >
            &#9733;
            {/* Burst particles — only rendered during animation */}
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
        <h3>{movie.title}</h3>
        <p>{movie.release_date?.split("-")[0]}</p>
      </div>
    </div>
  );
}

export default MovieCard;