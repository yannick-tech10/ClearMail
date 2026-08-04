require("dotenv").config();

const express = require("express");
const OpenAI = require("openai");

const app = express();

app.use(express.json());
app.use(express.static("public"));

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

app.post("/rewrite", async (req, res) => {

    try {

        const { email, tone, mode, replyNotes } = req.body;

        let systemPrompt = "";
        let userPrompt = "";

        if (mode === "reply") {
            systemPrompt = `You are ClearMail, an expert email assistant.
Your task is to draft a clear, professional email reply based on an incoming email and user instructions.

Guidelines:
- Fix grammar and spelling.
- Keep the response clear, concise, and structured like a real email.
- Maintain the requested tone (${tone}).
- Direct answer without unnecessary fluff.

Return only the reply email.`;

            userPrompt = `Incoming Email:\n"${email}"\n\nKey Points to Include in Reply:\n"${replyNotes || "Draft an appropriate response."}"\n\nDraft a response in a ${tone} tone.`;
        } else {
            systemPrompt = `You are ClearMail, an expert email writing assistant.

Rewrite emails by:
- fixing grammar and spelling
- improving clarity
- preserving the original meaning
- using the requested tone
- making the email concise and professional
- formatting it like a real email

Return only the rewritten email.`;

            userPrompt = `Rewrite this email in a ${tone} tone:\n\n${email}`;
        }

        const response = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: systemPrompt
                },
                {
                    role: "user",
                    content: userPrompt
                }
            ]
        });

        const result = response.choices[0].message.content;

        res.json({ result });

    } catch (error) {

        console.error(error);

        res.json({
            result: "Error generating email."
        });

    }

});

app.listen(3000, () => {
    console.log("ClearMail running on http://localhost:3000");
});