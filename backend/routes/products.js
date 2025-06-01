const express = require("express");
const router = express.Router();
const pool = require("../db");
const authenticateToken = require("../token/token");
const requireRole = require("../token/requireRole");


const safeNumber = (val) => {
  if (val === "" || isNaN(Number(val))) return null;
  return Number(val);
};

async function updateProduct({ id, name, description, price, category }) {
  return pool.query(
    "UPDATE products SET name = $1, description = $2, price = $3, category = $4 WHERE id = $5",
    [name, description, safeNumber(price), category, id]
  );
}


async function createProduct({ name, description, price, category }) {
  return pool.query(
    "INSERT INTO products (name, description, price, category) VALUES ($1, $2, $3, $4)",
    [name, description, price, category]
  );
}

async function deleteProduct(id) {
  return pool.query("DELETE FROM products WHERE id = $1", [id]);
}

async function updateProducts(req, res) {
  const { products } = req.body;
  if (!Array.isArray(products)) {
    return res.status(400).json({ message: "Невірний формат даних" });
  }

  try {
    for (const product of products) {
      const id = product.id;
    
      if (id !== undefined && id !== null && Number.isInteger(id)) {
        const result = await pool.query("SELECT 1 FROM products WHERE id = $1", [id]);
        if (result.rowCount > 0) {
          await updateProduct(product);
          continue;
        }
      }
    
      const { id: _, ...dataWithoutId } = product;
      await createProduct(dataWithoutId);    
    }
    res.status(200).json({ message: "Продукти оновлено" });
  } catch (err) {
    console.error("Помилка оновлення продуктів:", err);
    res.status(500).json({ message: "Помилка сервера" });
  }
}

router.put("/", authenticateToken, requireRole, updateProducts);

router.get('/', async (req, res) => {
  const category = req.query.category;
  try {
    let query = 'SELECT * FROM products';
    let params = [];

    if (category) {
      query += ' WHERE category = $1';
      params.push(category);
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Помилка при отриманні товарів:', error);
    res.status(500).json({ error: 'Помилка сервера' });
  }
});

router.delete("/:id", authenticateToken, requireRole, async (req, res) => {
  const { id } = req.params;
  try {
    await deleteProduct(id);
    res.status(200).json({ message: "Продукт видалено" });
  } catch (err) {
    console.error("Помилка при видаленні продукту:", err);
    res.status(500).json({ message: "Помилка сервера" });
  }
});

module.exports = router;