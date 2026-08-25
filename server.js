const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;

app.post("/api/chat", async (req, res) => {
    try {
        const conversation = req.body.conversation;

        const response = await fetch(`${process.env.OLLAMA_URL}/api/chat`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                model: process.env.OLLAMA_MODEL,
                messages: [
                    {
                        role: "system",
                        content: "You are a helpful, friendly AI assistant. Give clear and accurate answers. Keep responses easy to understand."
                     },
                    ...conversation
                ],
                stream: false
            })
        });

        const data = await response.json();

        console.log("Ollama response:", data);
        if (!response.ok) {
             console.error("Ollama error:", data);

            return res.status(response.status).json({
                 error: data.error || "Ollama returned an error"
            });
        }

        if (!data.message || !data.message.content) {
            return res.status(500).json({
                error: "Invalid response from Ollama"
            });
        }

        res.json({
            reply: data.message.content
        });

    } catch (error) {
        console.error("Server error:", error);

        res.status(500).json({
            error: "Could not connect to Ollama"
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});