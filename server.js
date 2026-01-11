const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

// GET: ritorna lista elementi
app.get("/api/items", (req, res) => {
  db.query("SELECT * FROM items", (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// BONUS: POST per aggiungere un item
app.post("/api/items", (req, res) => {
  const { name } = req.body;
  db.query("INSERT INTO items (name) VALUES (?)", [name], err => {
    if (err) throw err;
    res.json({ message: "Item aggiunto!" });
  });
});

app.listen(3000, () => console.log("Backend avviato sulla porta 3000"));
 
express = require("express");
const bcrypt = require("bcrypt");
db = require("./db");

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

const authRoutes = require("./auth");
app.use("/auth", authRoutes);

const bookRoutes = require("./books");
app.use("/books", bookRoutes);

db = require("./db");
