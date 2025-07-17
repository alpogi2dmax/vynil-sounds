import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import bcrypt from 'bcrypt'
import path from 'node:path'

async function seedUsers() {
  const db = await open({
    filename: path.join('database.db'),
    driver: sqlite3.Database
  })

  const users = [
    { email: 'alcerdan@yahoo.com', password: 'password' },
    { email: 'glendalico@gmail.com', password: 'password' }
  ]

  try {
    await db.exec('BEGIN TRANSACTION')

    for (const { email, password } of users) {
      const hashedPassword = await bcrypt.hash(password, 10)
      await db.run(
        `INSERT INTO users (email, password) VALUES (?, ?)`,
        [email, hashedPassword]
      )
    }

    await db.exec('COMMIT')
    console.log('Users seeded successfully.')
  } catch (err) {
    await db.exec('ROLLBACK')
    console.error('Failed to seed users:', err.message)
  } finally {
    await db.close()
    console.log('Database connection closed.')
  }
}

seedUsers()