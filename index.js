import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "https://ton-site.com",
    "X-Title": "Mon API",
  },
});

const DEFAULT_ROLE = "Tu es un assistant très poli, clair et concis";

app.post("/ask", async (req, res) => {
  try {
    const { prompt, roleContent } = req.body;
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
    res.status(500).json({ error: err.message });
  }
});

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
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
