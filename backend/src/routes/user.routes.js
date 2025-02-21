const express = require('express');
const router = express.Router();
const userService = require('../services/user.service');
const { auth, encryptToken } = require('../middleware/auth');

router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Username, email, and password are required' });
        }
        const token = encryptToken(await userService.registerUser(req.body));
        res.status(201).json(token);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { identifier, password } = req.body;
        if (!identifier || !password) {
            return res.status(400).json({ error: 'Username or email and password are required' });
        }
        const token = encryptToken(await userService.loginUser(identifier, password));
        res.status(200).json(token);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});


router.get("/verify", auth, async (req, res) => {
    try {
        const { username } = req.user;
        const cleanUser = await userService.verifyUser(username);
        res.status(200).json(cleanUser);
    } catch (error) {
        console.error('Error from MongoDB:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
