const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;

app.post("/api/chat", async (req, res) => {
    try {
        const conversation = req.body.conversation;

        const response = await fetch("http://localhost:11434/api/chat", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                model: "llama3.2:3b",
                messages: conversation,
                stream: false
            })
        });

        const data = await response.json();

        console.log("Ollama response:", data);

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