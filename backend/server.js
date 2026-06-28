const cors = require('cors')
const express = require('express')
const { MongoClient } = require('mongodb')
require('dotenv').config()

const app = express()

// Configure CORS to accept requests from Vercel domain
app.use(cors({
    origin: ['http://localhost:5173', 'https://volkary-melwin.vercel.app'],
    credentials: true
}))

app.use(express.json())
const client = new MongoClient(process.env.MONGODB_URI)

async function start() {
    await client.connect()
    const db = client.db("watchlist")
    const movies = db.collection('movies')
    const TMDB_KEY = process.env.TMDB_API_KEY
    const TMDB_BASE = 'https://api.themoviedb.org/3'


    app.get('/popular', async (req, res) => {
        const url = `${TMDB_BASE}/movie/popular?api_key=${TMDB_KEY}`
        const resp = await fetch(url)
        const data = await resp.json()
        res.json(data.results.map(m => ({
            tmdbId: m.id,
            title: m.title,
            year: m.release_date?.slice(0, 4),
            poster: m.poster_path,
            genre: m.genre_ids?.join(',')
        })))
    })

    app.get('/search', async (req, res) => {
        const query = req.query.q
        if (!query) return res.json([])
        const url = `${TMDB_BASE}/search/movie?api_key=${TMDB_KEY}&query=${encodeURIComponent(query)}`
        const resp = await fetch(url)
        const data = await resp.json()
        res.json(data.results.map(m => ({

            tmdbId: m.id,
            title: m.title,
            year: m.release_date?.slice(0, 4),
            poster: m.poster_path,
            genre: m.genre_ids?.join(',')
        })))
    })



    app.get('/movies', async (req, res) => {
        const allMovies = await movies.find().toArray()
        res.json(allMovies)
    })




    app.post('/movies', async (req, res) => {
        const { tmdbId, title, year, genre, poster } = req.body
        if (tmdbId) {
            const existing = await movies.findOne({ tmdbId })
            if (existing) {
                return res.status(409).json({ message: 'Movie already in your watchlist' })
            }
        }
        const result = await movies.insertOne({ tmdbId, title, year, genre, poster, watched: false, createdAt: new Date() })
        res.json(result)
    })

    app.patch('/movies/:id', async (req, res) => {
        const { ObjectId } = require('mongodb')
        const movie = await movies.findOne({ _id: new ObjectId(req.params.id) })
        const result = await movies.updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: { watched: !movie.watched } }
        )
        res.json(result)
    })

    app.delete('/movies/:id', async (req, res) => {
        const { ObjectId } = require('mongodb')
        const result = await movies.deleteOne({ _id: new ObjectId(req.params.id) })
        res.json(result)
    })

    const PORT = process.env.PORT || 3000
    app.listen(PORT, () => console.log(`Running on ${PORT}`))
}

start()