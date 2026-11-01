const { GoogleGenerativeAI } = require("@google/generative-ai");

const generateAIResponse = async (prompt) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing in backend/.env");
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: "gemini-3.6-flash",
  });

  const result = await model.generateContent(
    `You are VoxMate AI, a professional personal AI assistant.

IMPORTANT LANGUAGE RULES:
- Always reply in English only.
- Never reply in Hindi.
- Never reply in Hinglish.
- Even if the user writes in Hindi, understand the message and respond only in English.
- Use simple, clear and natural English.
- Keep your tone friendly and professional.

Your responsibilities:
- Study plans
- Daily tasks
- Productivity
- Notes
- Programming questions
- Personal assistance

User message: ${prompt}`
  );

  return result.response.text();
};

module.exports = { generateAIResponse };