const { MongoClient } = require('mongodb')
require('dotenv').config()

const client = new MongoClient(process.env.MONGODB_URI)

const movies = [
  { title: "Inception", year: 2010, genre: "Sci-Fi" },
  { title: "The Dark Knight", year: 2008, genre: "Action" },
  { title: "Interstellar", year: 2014, genre: "Sci-Fi" },
  { title: "Parasite", year: 2019, genre: "Thriller" },
  { title: "The Shawshank Redemption", year: 1994, genre: "Drama" },
  { title: "Pulp Fiction", year: 1994, genre: "Crime" },
  { title: "The Matrix", year: 1999, genre: "Sci-Fi" },
  { title: "Forrest Gump", year: 1994, genre: "Drama" },
  { title: "Fight Club", year: 1999, genre: "Drama" },
  { title: "The Godfather", year: 1972, genre: "Crime" },
  { title: "Avengers: Endgame", year: 2019, genre: "Action" },
  { title: "The Lion King", year: 1994, genre: "Animation" },
  { title: "Gladiator", year: 2000, genre: "Action" },
  { title: "Titanic", year: 1997, genre: "Romance" },
  { title: "The Departed", year: 2006, genre: "Crime" },
  { title: "Whiplash", year: 2014, genre: "Drama" },
  { title: "Joker", year: 2019, genre: "Thriller" },
  { title: "The Prestige", year: 2006, genre: "Mystery" },
  { title: "Dune", year: 2021, genre: "Sci-Fi" },
  { title: "Oppenheimer", year: 2023, genre: "Drama" },
  { title: "Barbie", year: 2023, genre: "Comedy" },
  { title: "The Batman", year: 2022, genre: "Action" },
  { title: "Spider-Man: No Way Home", year: 2021, genre: "Action" },
  { title: "No Country for Old Men", year: 2007, genre: "Thriller" },
  { title: "Mad Max: Fury Road", year: 2015, genre: "Action" },
  { title: "The Grand Budapest Hotel", year: 2014, genre: "Comedy" },
  { title: "Get Out", year: 2017, genre: "Horror" },
  { title: "La La Land", year: 2016, genre: "Romance" },
  { title: "Everything Everywhere All at Once", year: 2022, genre: "Sci-Fi" },
  { title: "The Silence of the Lambs", year: 1991, genre: "Thriller" },
  { title: "Goodfellas", year: 1990, genre: "Crime" },
  { title: "Saving Private Ryan", year: 1998, genre: "War" },
  { title: "The Usual Suspects", year: 1995, genre: "Crime" },
  { title: "Schindler's List", year: 1993, genre: "Drama" },
  { title: "Back to the Future", year: 1985, genre: "Sci-Fi" },
  { title: "The Conjuring", year: 2013, genre: "Horror" },
  { title: "Deadpool", year: 2016, genre: "Comedy" },
  { title: "Toy Story", year: 1995, genre: "Animation" }
]

async function seed() {
  await client.connect()
  const db = client.db('watchlist')
  const moviesCollection = db.collection('movies')
  await moviesCollection.deleteMany({})
  const result = await moviesCollection.insertMany(movies.map(m => ({
    ...m,
    watched: false,
    createdAt: new Date()
  })))
  console.log(`Inserted ${result.insertedCount} movies`)
  await client.close()
}

seed()