import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./db.js";

dotenv.config();

console.log("Loaded environment variables:", {
  DATABASE_URL: process.env.DATABASE_URL,
});

const app = express();
app.use(cors());
app.use(express.json());

const ensureTables = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS todos (
      id SERIAL PRIMARY KEY,
      text TEXT NOT NULL,
      completed BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `);
};

app.get("/", (req, res) => {
  res.send("API running");
});

app.get("/todos", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, text, completed FROM todos ORDER BY completed, created_at"
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch todos" });
  }
});

app.post("/todos", async (req, res) => {
  try {
    const { text } = req.body;
    const trimmed = text?.trim();
    if (!trimmed) {
      return res.status(400).json({ error: "Task text is required" });
    }

    const result = await pool.query(
      "INSERT INTO todos (text) VALUES ($1) RETURNING id, text, completed",
      [trimmed]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create todo" });
  }
});

app.put("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;
    const result = await pool.query(
      "UPDATE todos SET completed = $1 WHERE id = $2 RETURNING id, text, completed",
      [completed, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update todo" });
  }
});

const start = async () => {
  await ensureTables();
  app.listen(5000, () => console.log("Server running on port 5000"));
};

start().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});