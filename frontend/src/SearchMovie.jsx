import { useState, useEffect } from 'react'

const API = import.meta.env.VITE_API_URL || '/api'

function SearchMovie({ onAdd }) {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetch(`${API}/popular`)
            .then(res => res.json())
            .then(data => setResults(data))
    }, [])

    const handleSearch = async (e) => {
        e.preventDefault()
        if (!query.trim()) return
        setLoading(true)
        const res = await fetch(`${API}/search?q=${encodeURIComponent(query)}`)
        const data = await res.json()
        setResults(data)
        setLoading(false)
    }

    const handleAdd = async (movie) => {
        const res = await fetch(`${API}/movies`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                tmdbId: movie.tmdbId,
                title: movie.title,
                year: movie.year,
                poster: movie.poster,
                genre: movie.genre
            })
        })
        if (res.status === 409) {
            alert('Already in your watchlist!')
            return
        }
        const data = await res.json()
        onAdd(data)
    }

    return (
        <div>
            <form onSubmit={handleSearch}>
                <input
                    placeholder='Search movies...'
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button type='submit'>Search</button>
            </form>

            {loading && <p>Searching...</p>}

            <div className='search-results'>
                {results.map(movie => (
                    <div key={movie.tmdbId} className='search-card'>
                        {movie.poster && (
                            <img
                                src={`https://image.tmdb.org/t/p/w200${movie.poster}`}
                                alt={movie.title}
                            />
                        )}
                        <div>
                            <h3>{movie.title}</h3>
                            <p>{movie.year} — {movie.genre}</p>
                            <button onClick={() => handleAdd(movie)}>Add</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SearchMovie
