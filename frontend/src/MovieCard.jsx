function MovieCard({ movie, onToggle, onDelete }) {
    return (
        <div className={`movie-card ${movie.watched ? 'watched' : ''}`}>
            {movie.poster && (
                <img
                    src={`https://image.tmdb.org/t/p/w200${movie.poster}`}
                    alt={movie.title}
                    className='movie-poster'
                />
            )}
            <div className='movie-info'>
                <h3>{movie.title}</h3>
                <p>{movie.year} {movie.genre}</p>
                <button onClick={() => onToggle(movie._id)}>{movie.watched ? 'Unwatch' : 'Watched'}</button>
                <button onClick={() => onDelete(movie._id)}>Delete</button>
            </div>
        </div>
    )
}

export default MovieCard