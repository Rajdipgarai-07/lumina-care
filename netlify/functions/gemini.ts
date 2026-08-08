import { GoogleGenAI } from "@google/genai";

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: { headers: { "User-Agent": "aistudio-build" } },
  });
}

// Netlify Function handler
export async function handler(event: any) {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  // Determine which endpoint was called from the URL path
  const path = event.path.replace("/.netlify/functions/gemini", "").replace("/api/gemini", "");
  const body = JSON.parse(event.body || "{}");

  try {
    // ── /api/gemini/reflection ──
    if (path === "/reflection" || path === "" || path === "/") {
      const { mood, reflection, studentContext } = body;
      const ai = getGeminiClient();

      if (!ai) {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            empatheticResponse: `Thank you for sharing your reflection on feeling ${mood?.label || mood || "this way"}. Remember that every emotion is valid during your academic journey. Take a deep breath!`,
            microTip: "Try 3 cycles of box breathing or step outside for a 5-minute study break.",
            affirmation: "You are doing your best, and your progress matters.",
          }),
        };
      }

      const prompt = `You are Lumina, a warm, compassionate, and non-clinical AI Student Wellness Mentor for university students.
A student named Jamie just logged their daily mood check-in:
- Mood: ${mood?.label || mood || "Calm"} (Intensity: ${mood?.intensity || 3}/5)
- Student Note / Reflection: "${reflection || "No note written"}"
- Current Academic Context: ${studentContext || "Midterms & Project Deadlines approaching"}

Please respond in JSON format with three fields:
1. "empatheticResponse": A warm, encouraging 2-3 sentence validation of their feelings tailored specifically for a university student.
2. "microTip": One quick, practical 1-minute actionable mental health tip (e.g. 5-4-3-2-1 grounding, hydration check, 2-minute posture stretch).
3. "affirmation": A inspiring 1-sentence student affirmation.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" },
      });

      const data = JSON.parse(response.text || "{}");
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          empatheticResponse: data.empatheticResponse || "Thank you for checking in today. Honor where you are right now.",
          microTip: data.microTip || "Take a gentle stretch and drink a glass of fresh water.",
          affirmation: data.affirmation || "You are capable of handling today's challenges step by step.",
        }),
      };
    }

    // ── /api/gemini/journal-prompt ──
    if (path === "/journal-prompt") {
      const { category, currentMood } = body;
      const ai = getGeminiClient();

      if (!ai) {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            prompts: [
              "What is one small win from your study session today?",
              "How can you extend kindness to yourself during this busy week?",
              "Name 3 things in your room right now that bring you comfort.",
            ],
          }),
        };
      }

      const prompt = `Generate 3 thoughtful, gentle journaling prompts for a college student who feels ${currentMood || "a bit overwhelmed"} and wants prompts under the category '${category || "Self-Care"}'. Return a JSON array of strings under key "prompts".`;

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" },
      });

      const data = JSON.parse(response.text || "{}");
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          prompts: data.prompts || [
            "What is one worry you can let go of for the next hour?",
            "How did you take care of your body today?",
            "What is something you are looking forward to after finals?",
          ],
        }),
      };
    }

    // ── /api/gemini/stress-insight ──
    if (path === "/stress-insight") {
      const { habitData } = body;
      const ai = getGeminiClient();

      if (!ai) {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            insightTitle: "Sleep & Mood Alignment",
            insightText: "Your sleep averaged 7.5 hours this week. On days with 8+ hours of sleep, your mood scores were 25% higher during study sessions!",
            recommendation: "Aim to keep a consistent bedtime even during study crunch times.",
          }),
        };
      }

      const prompt = `Analyze this student weekly habit data: ${JSON.stringify(habitData || {})}. Provide a encouraging data-driven insight in JSON with keys: "insightTitle", "insightText", "recommendation".`;

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" },
      });

      const data = JSON.parse(response.text || "{}");
      return { statusCode: 200, headers, body: JSON.stringify(data) };
    }

    return { statusCode: 404, headers, body: JSON.stringify({ error: "Unknown endpoint" }) };
  } catch (err: any) {
    console.error("Gemini function error:", err);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        empatheticResponse: "Thank you for checking in! Remember that balancing student life is a journey.",
        microTip: "Close your eyes for 30 seconds and let your shoulders drop away from your ears.",
        affirmation: "You are stronger than any single exam or assignment.",
      }),
    };
  }
}
