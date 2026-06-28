import { useState, useEffect } from 'react'

const API = import.meta.env.VITE_API_URL || '/api'

function SearchMovie({ onAdd }) {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(false)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    const fetchMovies = async (url) => {
        setLoading(true)
        try {
            const res = await fetch(url)
            if (!res.ok) throw new Error(`HTTP ${res.status}`)
            const data = await res.json()
            setResults(data.results)
            setTotalPages(data.totalPages)
            setPage(data.page)
        } catch (err) {
            alert('Failed to fetch: ' + err.message)
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchMovies(`${API}/popular?page=1`)
    }, [])

    const handleSearch = (e) => {
        e.preventDefault()
        if (!query.trim()) return
        setPage(1)
        fetchMovies(`${API}/search?q=${encodeURIComponent(query)}&page=1`)
    }

    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages) return
        if (query.trim()) {
            fetchMovies(`${API}/search?q=${encodeURIComponent(query)}&page=${newPage}`)
        } else {
            fetchMovies(`${API}/popular?page=${newPage}`)
        }
    }

    const handleAdd = async (movie) => {
        try {
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
            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`)
            }
            const data = await res.json()
            onAdd(data)
        } catch (err) {
            alert('Failed to add movie: ' + err.message)
        }
    }

    const pages = []
    const startPage = Math.max(1, page - 2)
    const endPage = Math.min(totalPages, page + 2)
    for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
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

            {loading && <p className='loading'>Loading...</p>}

            <div className='search-results'>
                {results.map(movie => (
                    <div key={movie.tmdbId} className='search-card'>
                        {movie.poster && (
                            <img
                                src={`https://image.tmdb.org/t/p/w200${movie.poster}`}
                                alt={movie.title}
                            />
                        )}
                        <div className='search-card-info'>
                            <h3>{movie.title}</h3>
                            <p>{movie.year} — {movie.genre}</p>
                            <button onClick={() => handleAdd(movie)}>+ Add</button>
                        </div>
                    </div>
                ))}
            </div>

            {totalPages > 1 && (
                <div className='pagination'>
                    <button
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                    >Prev</button>
                    {pages.map(n => (
                        <button
                            key={n}
                            onClick={() => handlePageChange(n)}
                            className={n === page ? 'active' : ''}
                        >{n}</button>
                    ))}
                    <button
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === totalPages}
                    >Next</button>
                </div>
            )}
        </div>
    )
}

export default SearchMovie
