const express = require("express");
const router = express.Router();
const pool = require("../db");
const authenticateToken = require("../token/token.js");

router.post("/", authenticateToken, async (req, res) => {
  try {
    const { topic, message } = req.body;
    const userId = req.user.id;

    if (!topic || !message) {
      return res.status(400).json({ message: "Заповніть всі поля" });
    }

    const result = await pool.query(
      "INSERT INTO messages (topic, message, user_id, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *",
      [topic, message, userId]
    );

    res.status(201).json({ message: "Повідомлення надіслано.", data: result.rows[0] });
  } catch (err) {
    console.error("Помилка при надсиланні повідомлення:", err);
    res.status(500).json({ message: "Помилка сервера." });
  }
});

router.get("/user", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query(
      "SELECT * FROM messages WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Помилка при завантаженні повідомлень" });
  }
});

module.exports = router;