import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";

// Charge les variables d'environnement
dotenv.config();

const app = express();
app.use(express.json());

// Vérifie que la clé est présente
if (!process.env.OPENROUTER_API_KEY) {
  console.error("❌ OPENROUTER_API_KEY non définie !");
  process.exit(1);
}

// Configure OpenAI / OpenRouter
const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "https://ton-site.com",
    "X-Title": "Mon API",
  },
});

// Rôle par défaut
const DEFAULT_ROLE = "Tu es un assistant très poli, clair et concis";

// POST /ask
app.post("/ask", async (req, res) => {
  try {
    const { prompt, roleContent } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt manquant" });
    }

    const messages = [
      { role: "system", content: roleContent || DEFAULT_ROLE },
      { role: "user", content: prompt },
    ];

    const completion = await openai.chat.completions.create({
      model: "deepseek/deepseek-chat-v3.1:free",
      messages,
    });

    res.json({ reply: completion.choices[0].message });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// GET /ask
app.get("/ask", async (req, res) => {
  try {
    const prompt = req.query.prompt || "Bonjour";
    const roleContent = req.query.role || DEFAULT_ROLE;

    const messages = [
      { role: "system", content: roleContent },
      { role: "user", content: prompt },
    ];

    const completion = await openai.chat.completions.create({
      model: "deepseek/deepseek-chat-v3.1:free",
      messages,
    });

    res.json({ reply: completion.choices[0].message });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Lancement du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
