import { useState, useEffect } from 'react'
import SearchMovie from './SearchMovie'
import MovieList from './MovieList'
import './App.css'

const API = import.meta.env.VITE_API_URL || '/api'

function App() {
  const [movies, setMovies] = useState([])

  useEffect(() => {
    fetch(`${API}/movies`)
      .then(res => res.json())
      .then(data => setMovies(data))
  }, [])

  const addMovie = async () => {
    const res = await fetch(`${API}/movies`)
    const data = await res.json()
    setMovies(data)
  }

  const toggleWatched = async (id) => {
    await fetch(`${API}/movies/${id}`, { method: 'PATCH' })
    const res = await fetch(`${API}/movies`)
    const data = await res.json()
    setMovies(data)
  }

  const deleteMovie = async (id) => {
    await fetch(`${API}/movies/${id}`, { method: 'DELETE' })
    const res = await fetch(`${API}/movies`)
    const data = await res.json()
    setMovies(data)
  }

  const unwatched = movies.filter(m => !m.watched)
  const watched = movies.filter(m => m.watched)

  return (
    <div className='app'>
      <h1>Movie Watchlist</h1>
      <div className='main-grid'>
        <div className='column column-left'>
          <h2>Watching</h2>
          <MovieList movies={unwatched} onToggle={toggleWatched} onDelete={deleteMovie} />
        </div>
        <div className='column column-center'>
          <SearchMovie onAdd={addMovie} />
        </div>
        <div className='column column-right'>
          <h2>Watched</h2>
          <MovieList movies={watched} onToggle={toggleWatched} onDelete={deleteMovie} />
        </div>
      </div>
    </div>
  )
}

export default App
