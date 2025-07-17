import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import path from 'node:path'

async function getData() {
    const db = await open({
        filename: path.join('database.db'),
        driver: sqlite3.Database
    })

    try {
        // const query = 'SELECT genre FROM products WHERE title=?'
        const query = 'SELECT genre FROM products'
        // const params = ['Lost Cartography']
        // const products = await db.all(query, params)
        const products = await db.all(query)
        console.log(products.map(item => item.genre))
    } catch (err) {
        console.log(err)
    }
}

getData()