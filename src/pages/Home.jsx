import MovieCard from "../component/MovieCard";
import {useState} from "react";

function Home() {

    const [searchTerm, setSearchTerm] = useState("");
    const movies = [
        {id: 1, title: "The Matrix", release_date: "1999" },
        {id: 2, title: "Inception", release_date: "2010" },
        {id: 3, title: "Interstellar", release_date: "2014" }
    ];
    const handleSearch = (e) => {
        e.preventDefault();
        alert(searchTerm);
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
        <div className="movie-grid">
            {movies.map((movie) =>(
                <MovieCard key={movie.id} movie={movie} />
            ))}
        </div>
    </div>
    );
}

export default Home