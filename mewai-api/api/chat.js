export default async function handler(req, res) {
  const prompt = req.headers["prompt"];

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": "Bearer OPENROUTER_API_KEY",
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

  res.json({
    message: data.choices[0].message.content
  });
}