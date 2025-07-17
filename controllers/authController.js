import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { getDBConnection } from '../db/db.js'

export async function registerUser(req, res) {
    const { email, password } = req.body
    try {
        const db = await getDBConnection()
        const hashedPassword = await bcrypt.hash(password, 10)

        await db.run(
            'INSERT INTO users (email, password) VALUES (?, ?)',
            email, hashedPassword
        )

        res.status(201).json({ message: 'User registered successfully' })

    } catch (err) {
        res.status(500).json({ error: 'Registration failed', details: err.message })
    }
}

export async function loginUser(req, res) {
    const { email, password } = req.body
    try {
        const db = await getDBConnection()
        const user = await db.get('SELECT * FROM users WHERE email = ?', email)

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Invalid credentials'})
        }

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h'})

        res.json({ message: 'Login successful', token})

    } catch (err) {
        res.status(500).json({error: 'Login failed', details: err.message})
    }
}