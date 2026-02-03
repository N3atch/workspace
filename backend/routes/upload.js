const express = require('express');
const upload = require('../middleware/upload');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const router = express.Router();

// Upload image (Admin only)
router.post('/', authenticateToken, requireAdmin, upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        res.json({
            message: 'File uploaded successfully',
            filename: req.file.filename,
            path: `/upload/${req.file.filename}`
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'File upload failed' });
    }
});

module.exports = router;

