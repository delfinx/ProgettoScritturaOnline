const express = require("express");
const db = require("./db");

const router = express.Router();

// GET - lista libri
router.get("/", (req, res) => {
  db.query("SELECT * FROM books", (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// POST - crea un nuovo libro
router.post("/", (req, res) => {
  const { title } = req.body;
  db.query("INSERT INTO books (title) VALUES (?)", [title], err => {
    if (err) throw err;
    res.json({ message: "Libro aggiunto" });
  });
});

// PUT - aggiorna il titolo
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  db.query("UPDATE books SET title=? WHERE id=?", [title, id], err => {
    if (err) throw err;
    res.json({ message: "Libro aggiornato" });
  });
});

// DELETE - opzionale
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM books WHERE id=?", [id], err => {
    if (err) throw err;
    res.json({ message: "Libro eliminato" });
  });
});

module.exports = router;

const db = require("./db");
