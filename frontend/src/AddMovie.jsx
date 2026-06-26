import { useState } from 'react'

function AddMovie({ onAdd }) {
    const [title, setTitle] = useState('')
    const [year, setYear] = useState('')
    const [genre, setGenre] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!title) return
        onAdd({ title, year: Number(year), genre })
        setTitle('')
        setYear('')
        setGenre('')
    }

    return (
        <form onSubmit={handleSubmit}>
            <input
                placeholder='Movie title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <input
                placeholder='Year'
                value={year}
                onChange={(e) => setYear(e.target.value)}
            />
            <input
                placeholder='Genre'
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
            />
            <button type='submit'>Add Movie</button>
        </form>
    )
}

export default AddMovie