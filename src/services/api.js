const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export async function getPopularMovies(page = 1) {
  const response = await fetch(
    `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`
  );
  if (!response.ok) throw new Error("Failed to fetch popular movies");
  const data = await response.json();
  return {
    movies: data.results,
    totalPages: data.total_pages,
  };
}

export async function searchMovies(query, page = 1) {
  const response = await fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`
  );
  if (!response.ok) throw new Error("Failed to search movies");
  const data = await response.json();
  return {
    movies: data.results,
    totalPages: data.total_pages,
  };
}