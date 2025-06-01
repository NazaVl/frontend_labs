const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");
const productEdit = require("./routes/products")
const authenticateToken = require("./token/token");


app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/products", productEdit)
app.get("/api/auth/verify", authenticateToken, (req, res) => {
    res.json({ valid: true });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Port ${PORT}`));