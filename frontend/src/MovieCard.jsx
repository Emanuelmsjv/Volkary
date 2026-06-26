function MovieCard({ movie, onToggle, onDelete }) {
    return (
        <div className={`movie-card ${movie.watched ? 'watched' : ''}`}>
            <h3>{movie.title}</h3>
            <p>{movie.year} {movie.genre}</p>
            <button onClick={() => onToggle(movie._id)}>{movie.watched ? 'Unwatch' : 'Watched'}</button>
            <button onClick={() => onDelete(movie._id)}>Delete</button>
        </div>
    )
}

export default MovieCard