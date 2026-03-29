export default async function handler(req, res) {
  try {
    const prompt = req.headers["prompt"];
    if (!prompt) {
      return res.status(400).json({ message: "Prompt missing" });
    }

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

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ message: "OpenRouter Error: " + errText });
    }

    const data = await response.json();
    res.status(200).json({ message: data.choices[0].message.content });

  } catch (err) {
    res.status(500).json({ message: "Server Error: " + err.message });
  }
}
