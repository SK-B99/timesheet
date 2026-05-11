const express = require("express");
const router = express.Router();

router.post("/generate", async (req, res) => {
  const { roughNotes, context } = req.body;

  if (!roughNotes || !context) {
    return res.status(400).json({
      error: "Missing notes or context",
    });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        max_tokens: 300,
        messages: [
          {
            role: "system",
            content:
              "You help fill professional work timesheet descriptions. Be concise, factual, and professional.",
          },
          {
            role: "user",
            content: `Work context:
- Date: ${context.date} (${context.weekday})
- Type: ${context.type}
- Hours: ${context.start} to ${context.end}
- Location: ${context.location}

My rough notes: "${roughNotes}"

Write a clean professional timesheet description. 2-4 short sentences. No fluff.`,
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenAI error:", data);
      return res.status(500).json({ error: "Failed to generate description" });
    }

    const description = data.choices[0].message.content;

    console.log(
      `[${new Date().toISOString()}] User: ${req.user.name} | Notes: "${roughNotes.substring(0, 50)}..."`,
    );

    res.json({ description });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Failed to generate description" });
  }
});

module.exports = router;
