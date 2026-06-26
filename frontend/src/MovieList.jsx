import MovieCard from './MovieCard'

function MovieList({ movies, onToggle, onDelete }) {
    return (
        <div className='movie-list'>
            {movies.map(movie => (
                <MovieCard
                    key={movie._id}
                    movie={movie}
                    onToggle={onToggle}
                    onDelete={onDelete}></MovieCard>
            ))}
        </div>
    );

}

export default MovieList