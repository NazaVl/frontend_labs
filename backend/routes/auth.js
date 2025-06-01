const express = require("express");
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authenticateToken = require("../token/token.js");



router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);

    try {
        const user = await pool.query(
            "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
            [name, email, hashed]
        );
        res.json(user.rows[0]);
    } catch (err) {
        res.status(400).json({ error: "Користувач уже існує" });
    }
});


router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        const user = result.rows[0];

        if (!user) return res.status(401).json({ error: "Користувача не знайдено" });

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(401).json({ error: "Невірний пароль" });

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({ 
            token, 
            user: {
                id: user.id,
                email: user.email,
                role: user.role,

            }
        });
    } catch (err) {
        res.status(500).json({ error: "Помилка сервера" });
    }
});


router.get("/profile", authenticateToken, async (req, res) => {
    try {
        const user = await pool.query("SELECT name FROM users WHERE id = $1", [req.user.id]);
        if (user.rows.length === 0) return res.status(404).json({ message: "Користувача не знайдено" });
        res.json({ name: user.rows[0].name });
    } catch (error) {
        res.status(500).json({ message: "Помилка сервера" });
    }
});

router.get("/verify", async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ valid: false });

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const result = await pool.query("SELECT id, email, role, name FROM users WHERE id = $1", [userId]);
        const user = result.rows[0];

        if (!user) return res.status(401).json({ valid: false });

        res.json({ valid: true, user });
    } catch (err) {
        res.status(401).json({ valid: false });
    }
});

module.exports = router;