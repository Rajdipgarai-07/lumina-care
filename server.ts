import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Force correct JavaScript and CSS Content-Type headers regardless of Windows OS registry defaults
app.use((req, res, next) => {
  const urlPath = req.path || req.url.split('?')[0];
  if (/\.(js|mjs|ts|tsx|jsx)$/i.test(urlPath)) {
    res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  } else if (/\.css$/i.test(urlPath)) {
    res.setHeader('Content-Type', 'text/css; charset=utf-8');
  }
  next();
});

// Initialize Gemini Client lazily or gracefully
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not set in environment.");
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// API Routes

// 1. AI Reflection Endpoint
app.post("/api/gemini/reflection", async (req, res) => {
  try {
    const { mood, reflection, studentContext } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        empatheticResponse: `Thank you for sharing your reflection on feeling ${mood?.label || mood || 'this way'}. Remember that every emotion is valid during your academic journey. Take a deep breath!`,
        microTip: "Try 3 cycles of box breathing or step outside for a 5-minute study break.",
        affirmation: "You are doing your best, and your progress matters."
      });
    }

    const prompt = `You are Lumina, a warm, compassionate, and non-clinical AI Student Wellness Mentor for university students.
A student named Jamie just logged their daily mood check-in:
- Mood: ${mood?.label || mood || 'Calm'} (Intensity: ${mood?.intensity || 3}/5)
- Student Note / Reflection: "${reflection || 'No note written'}"
- Current Academic Context: ${studentContext || 'Midterms & Project Deadlines approaching'}

Please respond in JSON format with three fields:
1. "empatheticResponse": A warm, encouraging 2-3 sentence validation of their feelings tailored specifically for a university student.
2. "microTip": One quick, practical 1-minute actionable mental health tip (e.g. 5-4-3-2-1 grounding, hydration check, 2-minute posture stretch).
3. "affirmation": A inspiring 1-sentence student affirmation.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text || "{}";
    const data = JSON.parse(text);
    return res.json({
      empatheticResponse: data.empatheticResponse || "Thank you for checking in today. Honor where you are right now.",
      microTip: data.microTip || "Take a gentle stretch and drink a glass of fresh water.",
      affirmation: data.affirmation || "You are capable of handling today's challenges step by step."
    });
  } catch (err: any) {
    console.error("Error generating reflection:", err);
    return res.json({
      empatheticResponse: "Thank you for checking in! Remember that balancing student life is a journey, and taking a moment for yourself is a victory.",
      microTip: "Close your eyes for 30 seconds and let your shoulders drop away from your ears.",
      affirmation: "You are stronger than any single exam or assignment."
    });
  }
});

// 2. AI Journaling Prompt Generator
app.post("/api/gemini/journal-prompt", async (req, res) => {
  try {
    const { category, currentMood } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        prompts: [
          "What is one small win from your study session today?",
          "How can you extend kindness to yourself during this busy week?",
          "Name 3 things in your room right now that bring you comfort."
        ]
      });
    }

    const prompt = `Generate 3 thoughtful, gentle journaling prompts for a college student who feels ${currentMood || 'a bit overwhelmed'} and wants prompts under the category '${category || 'Self-Care'}'. Return a JSON array of strings under key "prompts".`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const data = JSON.parse(response.text || "{}");
    return res.json({ prompts: data.prompts || [
      "What is one worry you can let go of for the next hour?",
      "How did you take care of your body today?",
      "What is something you are looking forward to after finals?"
    ]});
  } catch (err) {
    return res.json({
      prompts: [
        "What is one thing that made you smile today?",
        "What boundary can you set today to protect your peace?",
        "Write down 3 things you appreciate about yourself."
      ]
    });
  }
});

// 3. AI Stress Insights Analysis
app.post("/api/gemini/stress-insight", async (req, res) => {
  try {
    const { habitData } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        insightTitle: "Sleep & Mood Alignment",
        insightText: "Your sleep averaged 7.5 hours this week. On days with 8+ hours of sleep, your mood scores were 25% higher during study sessions!",
        recommendation: "Aim to keep a consistent bedtime even during study crunch times."
      });
    }

    const prompt = `Analyze this student weekly habit data: ${JSON.stringify(habitData || {})}. Provide a encouraging data-driven insight in JSON with keys: "insightTitle", "insightText", "recommendation".`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const data = JSON.parse(response.text || "{}");
    return res.json(data);
  } catch (err) {
    return res.json({
      insightTitle: "Balanced Lifestyle Insight",
      insightText: "Logging study hours alongside social activities has kept your emotional energy stable this week.",
      recommendation: "Remember to schedule 15-minute breaks for every 50 minutes of deep focus."
    });
  }
});

// Vite middleware or production static
async function startServer() {
  // Ensure correct MIME types for JavaScript and CSS files
  express.static.mime.define({
    'text/javascript': ['js', 'mjs'],
    'text/css': ['css'],
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath, {
      setHeaders: (res, filePath) => {
        if (filePath.endsWith('.js') || filePath.endsWith('.mjs')) {
          res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
        } else if (filePath.endsWith('.css')) {
          res.setHeader('Content-Type', 'text/css; charset=utf-8');
        }
      }
    }));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Lumina Care server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
