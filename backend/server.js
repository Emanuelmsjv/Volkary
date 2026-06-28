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

    app.get('/movies', async (req, res) => {
        const allMovies = await movies.find().toArray()
        res.json(allMovies)
    })

    app.post('/movies', async (req, res) => {
        const { title, year, genre, poster } = req.body
        const result = await movies.insertOne({ title, year, genre, poster, watched: false, createdAt: new Date() })
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