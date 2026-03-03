import './App.css'
import MovieCard from './component/MovieCard'

function App() {

  return (
    <>
    <MovieCard movie={{title: "The Matrix", release_date: "1999-03-31"}} />
    <MovieCard movie={{title: "The Matrix", release_date: "1999-03-31"}} />

    </>
  )
}

export default App
