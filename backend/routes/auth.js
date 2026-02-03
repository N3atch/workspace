const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../database/db');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
    try {
        const { first_name, last_name, username, password } = req.body;

        // Validate all fields are provided
        if (!first_name || !last_name || !username || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if username already exists
        const [existingUsers] = await pool.execute(
            'SELECT id FROM users WHERE username = ?',
            [username]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user
        const [result] = await pool.execute(
            'INSERT INTO users (first_name, last_name, username, password) VALUES (?, ?, ?, ?)',
            [first_name, last_name, username, hashedPassword]
        );

        // Generate token
        const token = jwt.sign(
            { userId: result.insertId },
            process.env.JWT_SECRET || 'your-secret-key-here',
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: result.insertId,
                username,
                first_name,
                last_name,
                is_admin: false
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        
        // Provide more specific error messages
        if (error.code === 'ECONNREFUSED') {
            return res.status(503).json({ 
                error: 'Database connection failed. Please make sure MySQL is running and the database is created.',
                details: 'Run schema.sql in MySQL first'
            });
        } else if (error.code === 'ER_BAD_DB_ERROR') {
            return res.status(503).json({ 
                error: 'Database not found. Please create the database first.',
                details: 'Run schema.sql in MySQL to create vacation_db database'
            });
        } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            return res.status(503).json({ 
                error: 'Database access denied. Please check your MySQL credentials in .env file.'
            });
        }
        
        res.status(500).json({ 
            error: 'Internal server error',
            message: error.message 
        });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        // Find user
        const [users] = await pool.execute(
            'SELECT id, username, password, first_name, last_name, is_admin FROM users WHERE username = ?',
            [username]
        );

        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = users[0];

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate token
        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET || 'your-secret-key-here',
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                username: user.username,
                first_name: user.first_name,
                last_name: user.last_name,
                is_admin: user.is_admin
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        
        // Provide more specific error messages
        if (error.code === 'ECONNREFUSED') {
            return res.status(503).json({ 
                error: 'Database connection failed. Please make sure MySQL is running and the database is created.',
                details: 'Run schema.sql in MySQL first'
            });
        } else if (error.code === 'ER_BAD_DB_ERROR') {
            return res.status(503).json({ 
                error: 'Database not found. Please create the database first.',
                details: 'Run schema.sql in MySQL to create vacation_db database'
            });
        } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            return res.status(503).json({ 
                error: 'Database access denied. Please check your MySQL credentials in .env file.'
            });
        }
        
        res.status(500).json({ 
            error: 'Internal server error',
            message: error.message 
        });
    }
});

module.exports = router;

