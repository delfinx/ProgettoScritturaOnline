const express = require("express");
const bcrypt = require("bcrypt");
const db = require("./db");

const router = express.Router();

// REGISTRAZIONE
router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO users (email, password) VALUES (?, ?)",
    [email, hashed],
    err => {
      if (err) return res.status(400).json({ message: "Email già usata" });
      res.json({ message: "Registrazione ok!" });
    }
  );
});

// LOGIN
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, result) => {
      if (err) throw err;
      if (result.length === 0)
        return res.status(400).json({ message: "Utente non trovato" });

      const user = result[0];
      const ok = await bcrypt.compare(password, user.password);

      if (!ok) return res.status(401).json({ message: "Password sbagliata" });

      res.json({ message: "Login ok!" });
    }
  );
});

module.exports = router;
