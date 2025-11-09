// src/utils/aiRecommendBooks.js
export async function getAIRecommendations(bookTitle) {
  const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

  if (!API_KEY) {
    console.error("OpenAI API key not found. Please set it in .env file.");
    return "⚠️ AI recommendations are unavailable (missing API key).";
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful book recommendation assistant. You must always respond in clear bullet points with short explanations.",
          },
          {
            role: "user",
            content: `Recommend 3 books similar to "${bookTitle}". For each, include the title and a one-line reason why it’s similar.`,
          },
        ],
        temperature: 0.7,
        max_tokens: 200,
      }),
    });

    const data = await response.json();

    // Check if OpenAI returned an error
    if (data.error) {
      console.error("OpenAI API Error:", data.error);
      return `⚠️ AI error: ${data.error.message || "Something went wrong."}`;
    }

    const aiText = data.choices?.[0]?.message?.content?.trim();

    if (!aiText) {
      console.warn("Empty AI response:", data);
      return "🤖 No AI recommendations found for this book.";
    }

    // Format clean bullet list for display
    const formatted = aiText
      .replace(/^\d+\.\s*/gm, "• ") // replace numbered lists with bullets
      .replace(/\*\*/g, ""); // remove bold formatting if present

    return formatted;
  } catch (error) {
    console.error("AI recommendation error:", error);
    return "⚠️ Unable to generate AI recommendations. Please try again later.";
  }
}
