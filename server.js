const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;

app.post("/api/chat", async (req, res) => {
    try {
        const userMessage = req.body.message;

        const response = await fetch("http://localhost:11434/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama3.2:3b",
                messages: [
                    {
                        role: "user",
                        content: userMessage
                    }
                ],
                stream: false
            })
        });

        const data = await response.json();

        res.json({
            reply: data.message.content
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Could not connect to Ollama"
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});