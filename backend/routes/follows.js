const express = require('express');
const pool = require('../database/db');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Follow a vacation
router.post('/:vacationId', authenticateToken, async (req, res) => {
    try {
        const { vacationId } = req.params;
        const userId = req.user.id;

        // Check if vacation exists
        const [vacations] = await pool.execute(
            'SELECT id FROM vacations WHERE id = ?',
            [vacationId]
        );

        if (vacations.length === 0) {
            return res.status(404).json({ error: 'Vacation not found' });
        }

        // Check if already following
        const [existing] = await pool.execute(
            'SELECT id FROM follows WHERE user_id = ? AND vacation_id = ?',
            [userId, vacationId]
        );

        if (existing.length > 0) {
            return res.status(400).json({ error: 'Already following this vacation' });
        }

        // Add follow
        await pool.execute(
            'INSERT INTO follows (user_id, vacation_id) VALUES (?, ?)',
            [userId, vacationId]
        );

        // Update followers count
        await pool.execute(
            'UPDATE vacations SET followers_count = followers_count + 1 WHERE id = ?',
            [vacationId]
        );

        res.json({ message: 'Successfully followed vacation' });
    } catch (error) {
        console.error('Follow vacation error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Unfollow a vacation
router.delete('/:vacationId', authenticateToken, async (req, res) => {
    try {
        const { vacationId } = req.params;
        const userId = req.user.id;

        // Check if following
        const [existing] = await pool.execute(
            'SELECT id FROM follows WHERE user_id = ? AND vacation_id = ?',
            [userId, vacationId]
        );

        if (existing.length === 0) {
            return res.status(400).json({ error: 'Not following this vacation' });
        }

        // Remove follow
        await pool.execute(
            'DELETE FROM follows WHERE user_id = ? AND vacation_id = ?',
            [userId, vacationId]
        );

        // Update followers count
        await pool.execute(
            'UPDATE vacations SET followers_count = GREATEST(followers_count - 1, 0) WHERE id = ?',
            [vacationId]
        );

        res.json({ message: 'Successfully unfollowed vacation' });
    } catch (error) {
        console.error('Unfollow vacation error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;

