import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import path from 'node:path'

async function createUsersTable() {
  const db = await open({
    filename: path.join('database.db'),
    driver: sqlite3.Database,
  })

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )
  `)

  await db.close()
  console.log('Users table created')
}

createUsersTable()