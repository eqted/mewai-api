export default async (req) => {
  try {
    const url = new URL(req.url);
    let prompt;

    if (req.method === "POST") {
      try {
        const body = await req.json();
        prompt = body.prompt;
      } catch {
        // empty or invalid JSON body
      }
    } else {
      prompt = url.searchParams.get("prompt") || req.headers.get("prompt");
    }

    if (!prompt) {
      return Response.json({ error: "Prompt missing" }, { status: 400 });
    }

    const apiKey = Netlify.env.get("OPENROUTER_API_KEY");
    if (!apiKey) {
      return Response.json({ error: "API key not configured" }, { status: 500 });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + apiKey,
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

    if (!response.ok) {
      return Response.json({ error: "OpenRouter API error", details: data }, { status: response.status });
    }

    return Response.json({ message: data.choices[0].message.content });
  } catch (err) {
    return Response.json({ error: "Server Error: " + err.message }, { status: 500 });
  }
};

export const config = {
  path: "/api/chat"
};
