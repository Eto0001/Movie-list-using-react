import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMovieDetails } from "../services/api";
import { useMovieContext } from "../context/MovieContext";
import "../css/MovieDetail.css";

function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToFavorites, removeFromFavorites, isFavorite } = useMovieContext();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);

  const favorite = movie ? isFavorite(movie.id) : false;

  useEffect(() => {
    window.scrollTo({ top: 0 });
    setLoading(true);
    setError(null);
    getMovieDetails(id)
      .then(setMovie)
      .catch(() => setError("Failed to load movie details."))
      .finally(() => setLoading(false));
  }, [id]);

  function toggleFavorite() {
    if (!movie) return;
    favorite ? removeFromFavorites(movie.id) : addToFavorites(movie);
  }

  if (loading) return (
    <div className="detail-loading">
      <div className="detail-skeleton-backdrop" />
      <div className="detail-skeleton-body">
        <div className="detail-skeleton-poster" />
        <div className="detail-skeleton-info">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="detail-skeleton-line" style={{ width: `${90 - i * 12}%`, animationDelay: `${i * 0.08}s` }} />
          ))}
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="detail-error">
      <p>{error}</p>
      <button onClick={() => navigate(-1)}>← Go Back</button>
    </div>
  );

  if (!movie) return null;

  const backdrop = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : null;
  const poster = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Image";

  const ratingClass =
    movie.rating >= 7.5 ? "rating--high" :
    movie.rating >= 5   ? "rating--mid"  : "rating--low";

  const runtime = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
    : null;

  return (
    <div className="movie-detail">
      {/* Backdrop */}
      {backdrop && (
        <div className="detail-backdrop">
          <img src={backdrop} alt="" aria-hidden="true" />
          <div className="detail-backdrop-fade" />
        </div>
      )}

      {/* Back button */}
      <button className="detail-back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="detail-content">
        {/* Poster */}
        <div className="detail-poster">
          <img src={poster} alt={movie.title} />
        </div>

        {/* Info */}
        <div className="detail-info">
          <h1 className="detail-title">{movie.title}</h1>

          {movie.tagline && (
            <p className="detail-tagline">"{movie.tagline}"</p>
          )}

          {/* Meta row */}
          <div className="detail-meta">
            {movie.rating && (
              <span className={`detail-rating ${ratingClass}`}>★ {movie.rating}</span>
            )}
            {movie.release_date && (
              <span className="detail-meta-item">{movie.release_date.split("-")[0]}</span>
            )}
            {runtime && (
              <span className="detail-meta-item">{runtime}</span>
            )}
            {movie.status && (
              <span className="detail-meta-item detail-status">{movie.status}</span>
            )}
          </div>

          {/* Genres */}
          {movie.genre_names?.length > 0 && (
            <div className="detail-genres">
              {movie.genre_names.map((g) => (
                <span key={g} className="detail-genre-tag">{g}</span>
              ))}
            </div>
          )}

          {/* Overview */}
          {movie.overview && (
            <div className="detail-section">
              <h3>Overview</h3>
              <p>{movie.overview}</p>
            </div>
          )}

          {/* Director */}
          {movie.director && (
            <div className="detail-section">
              <h3>Director</h3>
              <p>{movie.director}</p>
            </div>
          )}

          {/* Cast */}
          {movie.cast?.length > 0 && (
            <div className="detail-section">
              <h3>Cast</h3>
              <div className="detail-cast">
                {movie.cast.map((actor) => (
                  <div key={actor.id} className="cast-member">
                    <div className="cast-avatar">
                      {actor.profile_path
                        ? <img src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`} alt={actor.name} />
                        : <span>{actor.name[0]}</span>
                      }
                    </div>
                    <div className="cast-text">
                      <p className="cast-name">{actor.name}</p>
                      <p className="cast-character">{actor.character}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="detail-actions">
            <button
              className={`detail-fav-btn ${favorite ? "active" : ""}`}
              onClick={toggleFavorite}
            >
              {favorite ? "★ Saved" : "☆ Add to Favorites"}
            </button>
            {movie.trailer_key && (
              <button className="detail-trailer-btn" onClick={() => setShowTrailer(true)}>
                ▶ Watch Trailer
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Trailer modal */}
      {showTrailer && (
        <div className="trailer-modal" onClick={() => setShowTrailer(false)}>
          <div className="trailer-modal-inner" onClick={(e) => e.stopPropagation()}>
            <button className="trailer-close" onClick={() => setShowTrailer(false)}>✕</button>
            <iframe
              src={`https://www.youtube.com/embed/${movie.trailer_key}?autoplay=1`}
              title="Trailer"
              allowFullScreen
              allow="autoplay"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default MovieDetail;