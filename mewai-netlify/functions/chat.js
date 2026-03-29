import fetch from "node-fetch";

export async function handler(event, context) {
  try {
    const prompt = event.headers["prompt"];
    if (!prompt) return { statusCode: 400, body: "Prompt missing" };

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + process.env.OPENROUTER_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openchat/openchat-3.5",
        messages: [
          { role: "system", content: "You are MewAI, a friendly Discord bot." },
          { role: "user", content: prompt }
        ]
      })
    });

    const data = await response.json();
    return { statusCode: 200, body: JSON.stringify({ message: data.choices[0].message.content }) };

  } catch (err) {
    return { statusCode: 500, body: "Server Error: " + err.message };
  }
}