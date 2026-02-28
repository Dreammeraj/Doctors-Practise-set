import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("medquest.db");
const JWT_SECRET = "medquest-secret-key-123"; // In production, use env var

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    role TEXT DEFAULT 'user',
    subscription_status TEXT DEFAULT 'inactive'
  );

  CREATE TABLE IF NOT EXISTS questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    scenario TEXT,
    options TEXT, -- JSON array
    correct_answer INTEGER,
    explanation TEXT,
    specialty TEXT,
    format TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS attempts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    question_id INTEGER,
    selected_answer INTEGER,
    is_correct INTEGER,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(question_id) REFERENCES questions(id)
  );
`);

// Seed Admin and some questions if empty
const userCount = db.prepare("SELECT COUNT(*) as count FROM users").get() as { count: number };
if (userCount.count === 0) {
  const hashedPassword = bcrypt.hashSync("admin123", 10);
  db.prepare("INSERT INTO users (email, password, role, subscription_status) VALUES (?, ?, ?, ?)").run(
    "admin@medquest.com",
    hashedPassword,
    "admin",
    "active"
  );
}

const questionCount = db.prepare("SELECT COUNT(*) as count FROM questions").get() as { count: number };
if (questionCount.count === 0) {
  const sampleQuestions = [
    {
      scenario: "A 45-year-old male presents with sudden onset crushing chest pain radiating to the left arm. ECG shows ST-segment elevation in leads II, III, and aVF. What is the most likely diagnosis?",
      options: JSON.stringify(["Anterior MI", "Inferior MI", "Lateral MI", "Pericarditis"]),
      correct_answer: 1,
      explanation: "ST elevation in II, III, and aVF indicates an inferior wall myocardial infarction, usually involving the right coronary artery.",
      specialty: "Internal Medicine",
      format: "clinical scenario"
    },
    {
      scenario: "Which of the following is the most common cause of acute appendicitis in children?",
      options: JSON.stringify(["Fecalith", "Lymphoid hyperplasia", "Foreign body", "Parasitic infection"]),
      correct_answer: 1,
      explanation: "In children, lymphoid hyperplasia is the most common cause of appendiceal obstruction leading to appendicitis.",
      specialty: "Surgery",
      format: "basic sciences"
    },
    {
      scenario: "A 6-month-old infant is brought to the clinic for a routine check-up. The mother is concerned about the timing of the MMR vaccine. According to standard schedules, when should the first dose be given?",
      options: JSON.stringify(["6 months", "9 months", "12-15 months", "18 months"]),
      correct_answer: 2,
      explanation: "The first dose of the MMR vaccine is typically administered between 12 and 15 months of age.",
      specialty: "Pediatrics",
      format: "general practice"
    }
  ];

  const insertQ = db.prepare("INSERT INTO questions (scenario, options, correct_answer, explanation, specialty, format) VALUES (?, ?, ?, ?, ?, ?)");
  sampleQuestions.forEach(q => insertQ.run(q.scenario, q.options, q.correct_answer, q.explanation, q.specialty, q.format));
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // Auth Middleware
  const authenticate = (req: any, res: any, next: any) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    try {
      req.user = jwt.verify(token, JWT_SECRET);
      next();
    } catch (e) {
      res.status(401).json({ error: "Invalid token" });
    }
  };

  const isAdmin = (req: any, res: any, next: any) => {
    if (req.user?.role !== 'admin') return res.status(403).json({ error: "Forbidden" });
    next();
  };

  // Auth Routes
  app.post("/api/auth/register", (req, res) => {
    const { email, password } = req.body;
    try {
      const hashedPassword = bcrypt.hashSync(password, 10);
      const result = db.prepare("INSERT INTO users (email, password) VALUES (?, ?)").run(email, hashedPassword);
      const token = jwt.sign({ id: result.lastInsertRowid, email, role: 'user' }, JWT_SECRET);
      res.json({ token, user: { id: result.lastInsertRowid, email, role: 'user', subscription_status: 'inactive' } });
    } catch (e) {
      res.status(400).json({ error: "Email already exists" });
    }
  });

  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as any;
    if (user && bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET);
      res.json({ token, user: { id: user.id, email: user.email, role: user.role, subscription_status: user.subscription_status } });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  // Question Routes
  app.get("/api/questions", authenticate, (req, res) => {
    const { specialty, limit = 10 } = req.query;
    let query = "SELECT * FROM questions";
    const params: any[] = [];
    if (specialty) {
      query += " WHERE specialty = ?";
      params.push(specialty);
    }
    query += " ORDER BY RANDOM() LIMIT ?";
    params.push(limit);
    const questions = db.prepare(query).all(...params);
    res.json(questions.map((q: any) => ({ ...q, options: JSON.parse(q.options) })));
  });

  app.post("/api/questions", authenticate, isAdmin, (req, res) => {
    const { scenario, options, correct_answer, explanation, specialty, format } = req.body;
    const result = db.prepare("INSERT INTO questions (scenario, options, correct_answer, explanation, specialty, format) VALUES (?, ?, ?, ?, ?, ?)").run(
      scenario, JSON.stringify(options), correct_answer, explanation, specialty, format
    );
    res.json({ id: result.lastInsertRowid });
  });

  app.get("/api/admin/questions", authenticate, isAdmin, (req, res) => {
    const questions = db.prepare("SELECT * FROM questions ORDER BY created_at DESC").all();
    res.json(questions.map((q: any) => ({ ...q, options: JSON.parse(q.options) })));
  });

  app.delete("/api/questions/:id", authenticate, isAdmin, (req, res) => {
    db.prepare("DELETE FROM questions WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // Attempt Routes
  app.post("/api/attempts", authenticate, (req, res) => {
    const { question_id, selected_answer, is_correct } = req.body;
    db.prepare("INSERT INTO attempts (user_id, question_id, selected_answer, is_correct) VALUES (?, ?, ?, ?)").run(
      (req as any).user.id, question_id, selected_answer, is_correct ? 1 : 0
    );
    res.json({ success: true });
  });

  app.get("/api/analytics", authenticate, (req, res) => {
    const userId = (req as any).user.id;
    const stats = db.prepare(`
      SELECT 
        COUNT(*) as total_attempts,
        SUM(is_correct) as correct_attempts,
        (SELECT COUNT(*) FROM questions) as total_questions
      FROM attempts 
      WHERE user_id = ?
    `).get(userId) as any;

    const specialtyStats = db.prepare(`
      SELECT q.specialty, COUNT(*) as count, SUM(a.is_correct) as correct
      FROM attempts a
      JOIN questions q ON a.question_id = q.id
      WHERE a.user_id = ?
      GROUP BY q.specialty
    `).all(userId);

    res.json({ ...stats, specialtyStats });
  });

  // Subscription Mock
  app.post("/api/subscribe", authenticate, (req, res) => {
    db.prepare("UPDATE users SET subscription_status = 'active' WHERE id = ?").run((req as any).user.id);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  const PORT = 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
