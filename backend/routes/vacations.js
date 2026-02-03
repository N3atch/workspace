const express = require('express');
const pool = require('../database/db');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const router = express.Router();

// Get all vacations (with follow status for authenticated users)
router.get('/', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;

        // Get all vacations with follow status
        const [vacations] = await pool.execute(`
            SELECT 
                v.*,
                CASE WHEN f.user_id IS NOT NULL THEN 1 ELSE 0 END as is_following
            FROM vacations v
            LEFT JOIN follows f ON v.id = f.vacation_id AND f.user_id = ?
            ORDER BY 
                CASE WHEN f.user_id IS NOT NULL THEN 0 ELSE 1 END,
                v.start_date ASC
        `, [userId]);

        res.json(vacations);
    } catch (error) {
        console.error('Get vacations error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get single vacation
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const [vacations] = await pool.execute(`
            SELECT 
                v.*,
                CASE WHEN f.user_id IS NOT NULL THEN 1 ELSE 0 END as is_following
            FROM vacations v
            LEFT JOIN follows f ON v.id = f.vacation_id AND f.user_id = ?
            WHERE v.id = ?
        `, [userId, id]);

        if (vacations.length === 0) {
            return res.status(404).json({ error: 'Vacation not found' });
        }

        res.json(vacations[0]);
    } catch (error) {
        console.error('Get vacation error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create vacation (Admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { description, destination, image, start_date, end_date, price } = req.body;

        if (!description || !destination || !start_date || !end_date || !price) {
            return res.status(400).json({ error: 'All required fields must be provided' });
        }

        const [result] = await pool.execute(
            'INSERT INTO vacations (description, destination, image, start_date, end_date, price) VALUES (?, ?, ?, ?, ?, ?)',
            [description, destination, image || null, start_date, end_date, price]
        );

        const [newVacation] = await pool.execute(
            'SELECT * FROM vacations WHERE id = ?',
            [result.insertId]
        );

        // Emit socket event for new vacation
        if (global.emitVacationCreated) {
            global.emitVacationCreated(newVacation[0]);
        }

        res.status(201).json(newVacation[0]);
    } catch (error) {
        console.error('Create vacation error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update vacation (Admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { description, destination, image, start_date, end_date, price } = req.body;

        // Check if vacation exists
        const [existing] = await pool.execute(
            'SELECT id FROM vacations WHERE id = ?',
            [id]
        );

        if (existing.length === 0) {
            return res.status(404).json({ error: 'Vacation not found' });
        }

        // Build update query dynamically
        const updates = [];
        const values = [];

        if (description !== undefined) {
            updates.push('description = ?');
            values.push(description);
        }
        if (destination !== undefined) {
            updates.push('destination = ?');
            values.push(destination);
        }
        if (image !== undefined) {
            updates.push('image = ?');
            values.push(image);
        }
        if (start_date !== undefined) {
            updates.push('start_date = ?');
            values.push(start_date);
        }
        if (end_date !== undefined) {
            updates.push('end_date = ?');
            values.push(end_date);
        }
        if (price !== undefined) {
            updates.push('price = ?');
            values.push(price);
        }

        if (updates.length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }

        values.push(id);
        await pool.execute(
            `UPDATE vacations SET ${updates.join(', ')} WHERE id = ?`,
            values
        );

        const [updated] = await pool.execute(
            'SELECT * FROM vacations WHERE id = ?',
            [id]
        );

        // Emit socket event for updated vacation
        if (global.emitVacationUpdate) {
            global.emitVacationUpdate(updated[0]);
        }

        res.json(updated[0]);
    } catch (error) {
        console.error('Update vacation error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete vacation (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await pool.execute(
            'DELETE FROM vacations WHERE id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Vacation not found' });
        }

        // Emit socket event for deleted vacation
        if (global.emitVacationDeleted) {
            global.emitVacationDeleted(id);
        }

        res.json({ message: 'Vacation deleted successfully' });
    } catch (error) {
        console.error('Delete vacation error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get vacations with followers count for reports (Admin only)
router.get('/reports/followers', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const [reports] = await pool.execute(`
            SELECT 
                v.id,
                v.destination as vacation_name,
                COUNT(f.id) as followers_count
            FROM vacations v
            LEFT JOIN follows f ON v.id = f.vacation_id
            GROUP BY v.id, v.destination
            HAVING followers_count > 0
            ORDER BY followers_count DESC
        `);

        res.json(reports);
    } catch (error) {
        console.error('Get reports error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;

