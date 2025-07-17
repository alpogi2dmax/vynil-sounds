import { getDBConnection } from "../db/db.js"

export async function getGenres(req, res){


  try {

      const db = await getDBConnection()

      const genres = await db.all('SELECT DISTINCT genre FROM products')
      // console.log(genres.map(item => item.genre))
      res.json(genres.map(item => item.genre))

  } catch (err) {
    res.status(500).json({error: 'Failed to fetch genres', details: err.message})
  }

}

export async function getProducts(req, res){

  try {

      const db = await getDBConnection()

     const { genre } = req.query

     const { search } = req.query

     let query = 'SELECT * FROM products'
     let params = []

     if (genre) {
      query += ' WHERE genre = ?'
      params.push(genre)
     }

     if (search) {
      query += ' WHERE title LIKE ? OR artist LIKE ? OR genre LIKE ?'
      const searchPattern = `%${search}%`
      params.push(searchPattern, searchPattern, searchPattern)
     }

     const products = await db.all(query, params)
     res.json(products)

  } catch (err) {
    res.status(500).json({error: 'Failed to fetch genres', details: err.message})
  }

}

