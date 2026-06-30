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

        const { email, tone } = req.body;

        const response = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `You are ClearMail, an expert email writing assistant.

Rewrite emails by:

- fixing grammar and spelling
- improving clarity
- preserving the original meaning
- using the requested tone
- making the email concise and professional
- formatting it like a real email

Return only the rewritten email.` 
                },
                {
                    role: "user",
                    content: `Rewrite this email in a ${tone} tone:\n\n${email}`
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