import "../css/Favorites.css"
import { useMovieContext } from "../context/MovieContext"
import MovieCard from "../component/MovieCard"

function Favorites() {

    const { favorites } = useMovieContext()

    if(favorites) {
        return (
        <div className="favorites"> 
            <h2>Your Favorites</h2>
        <div className="movie-grid">
            {favorites.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
            ))}
        </div>
        </div>
        )
    }
    return (
        <div className="favorites-empty">
            <h2>No favorites yet. </h2>
            <p>Click the star icon on a movie to add it to your favorites.</p>
            </div>
    )
}

export default Favorites    