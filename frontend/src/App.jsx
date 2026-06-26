import { useState, useEffect } from 'react'
import AddMovie from './AddMovie'
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

  const addMovie = async (movie) => {
    await fetch(`${API}/movies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(movie)
    })
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

  return (
    <div className='app'>
      <h1>Movie Watchlist</h1>
      <AddMovie onAdd={addMovie} />
      <MovieList movies={movies} onToggle={toggleWatched} onDelete={deleteMovie} />
    </div>
  )
}

export default App