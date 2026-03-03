import MovieCard from "../component/MovieCard";
import {useState, useEffect} from "react";
import { searchMovies, getPopularMovies } from "../services/api";
import "../css/Home.css";

function Home() {

    const [searchTerm, setSearchTerm] = useState("");
    const [movies, setMovies] = useState([]);   
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadPopularMovies = async () => {
            try {
                const popularMovies = await getPopularMovies();
                setMovies(popularMovies);
            } catch (error) {
                console.error("Error loading popular movies:", error);
                setError("Failed to load popular movies. Please try again later.");

            }
            finally {
                setLoading(false);
            }
        };
        loadPopularMovies();
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        if(!searchTerm.trim()) return
        setLoading(true);
        try {
            const searchResults = await searchMovies(searchTerm)
            setMovies(searchResults);
            setError(null);
        }
        catch (error) {
            console.log(error)
            setError("Failed to search movies. Please try again later.");
        }
        finally{

        }

        setSearchTerm("");
    };

    return (
    <div className="home">
        <form onSubmit={handleSearch} className="search-form">
            <input 
                type="text" 
                placeholder="Search movies..." 
                className="search-input" 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        <button type="submit" className="search-button">Search</button>
        </form>


        {error && <div className="error-message">{error}</div>}

        {loading ? (
            <div className="loading">Loading...</div>
        ) : (
            <div className="movie-grid">
            {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
            ))}
        </div>
        )}
        </div>
    );
}

export default Home