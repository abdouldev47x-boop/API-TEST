import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "https://ton-site.com",//ici, tu mettras le lien de ton site api mais comme tu n'en a pas ce n'est pas nécessaire. je l'ai juste mis pour que tu saches que ça sera utile quand tu auras ton site api
    "X-Title": "Mon API",
  },
});


app.post("/ask", async (req, res) => {
  try {
    const { prompt } = req.body;
    const completion = await openai.chat.completions.create({
      model: "meta-llama/llama-3.3-8b-instruct:free",//ici tu met le modèle de l'api que tu as copier sur openrouter
      messages: [{ role: "user", content: prompt }],
    });

    res.json({ reply: completion.choices[0].message });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//cette partie est juste pour l'utilisation de l'api dans tes projets 
app.get("/ask", async (req, res) => {
  try {
    const prompt = req.query.prompt || "Bonjour";
    const completion = await openai.chat.completions.create({
      model: "deepseek/deepseek-chat-v3.1:free",
      messages: [{ role: "user", content: prompt }],
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
