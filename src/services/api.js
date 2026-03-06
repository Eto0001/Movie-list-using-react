const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

// Fetch once and cache — genres don't change
let genreCache = null;

export async function getGenres() {
  if (genreCache) return genreCache;
  const response = await fetch(
    `${BASE_URL}/genre/movie/list?api_key=${API_KEY}`
  );
  if (!response.ok) throw new Error("Failed to fetch genres");
  const data = await response.json();
  genreCache = Object.fromEntries(data.genres.map((g) => [g.id, g.name]));
  return genreCache;
}

export async function getPopularMovies(page = 1) {
  const [response, genres] = await Promise.all([
    fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`),
    getGenres(),
  ]);
  if (!response.ok) throw new Error("Failed to fetch popular movies");
  const data = await response.json();
  return {
    movies: data.results.map((m) => enrichMovie(m, genres)),
    totalPages: data.total_pages,
  };
}

export async function searchMovies(query, page = 1) {
  const [response, genres] = await Promise.all([
    fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`),
    getGenres(),
  ]);
  if (!response.ok) throw new Error("Failed to search movies");
  const data = await response.json();
  return {
    movies: data.results.map((m) => enrichMovie(m, genres)),
    totalPages: data.total_pages,
  };
}

export async function getMovieDetails(movieId) {
  const [detailsRes, creditsRes] = await Promise.all([
    fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=videos`),
    fetch(`${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}`),
  ]);
  if (!detailsRes.ok) throw new Error("Failed to fetch movie details");
  const details = await detailsRes.json();
  const credits = await creditsRes.json();

  const trailer = details.videos?.results?.find(
    (v) => v.type === "Trailer" && v.site === "YouTube"
  );

  return {
    ...details,
    rating: details.vote_average ? Math.round(details.vote_average * 10) / 10 : null,
    genre_names: details.genres?.map((g) => g.name) || [],
    trailer_key: trailer?.key || null,
    cast: credits.cast?.slice(0, 8) || [],
    director: credits.crew?.find((c) => c.job === "Director")?.name || null,
  };
}

// Attach genre names + rounded rating to each movie object
function enrichMovie(movie, genres) {
  return {
    ...movie,
    genre_names: (movie.genre_ids || []).slice(0, 3).map((id) => genres[id]).filter(Boolean),
    rating: movie.vote_average ? Math.round(movie.vote_average * 10) / 10 : null,
  };
}