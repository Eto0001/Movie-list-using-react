const API_KEY = "4c1375a92616beb3d2d05647b80a9c94";
const BASE_URL = "https://api.themoviedb.org/3";

export const getPopularMovies = async () => {
    try {
        const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error("Error fetching popular movies:", error);
        return [];
    }

};

export const searchMovies = async (query) => {
    try {
        const response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error("Error searching movies:", error);
        return [];
    }
};  