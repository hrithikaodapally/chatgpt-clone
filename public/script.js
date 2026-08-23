const input = document.getElementById("message-input");
const button = document.getElementById("send-button");
const chatBox = document.getElementById("chat-box");

button.addEventListener("click", sendMessage);

input.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});

async function sendMessage() {

    const message = input.value.trim();

    if (message === "") {
        return;
    }

    // Show user's message
    const userMessage = document.createElement("div");

    userMessage.className = "message user";

    userMessage.innerHTML = `<strong>You:</strong> ${message}`;

    chatBox.appendChild(userMessage);

    input.value = "";

    chatBox.scrollTop = chatBox.scrollHeight;

    // Show loading message
    const loadingMessage = document.createElement("div");

    loadingMessage.className = "message bot";

    loadingMessage.innerHTML = "<strong>AI:</strong> Thinking...";

    chatBox.appendChild(loadingMessage);

    try {

        // Send message to our Node.js server
        const response = await fetch("/api/chat", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                message: message
            })
        });

        const data = await response.json();

        // Display AI response
        if (data.reply) {

            loadingMessage.innerHTML =
                `<strong>AI:</strong> ${data.reply}`;

        } else {

            loadingMessage.innerHTML =
                "<strong>AI:</strong> Sorry, something went wrong.";

        }

    } catch (error) {

        console.error(error);

        loadingMessage.innerHTML =
            "<strong>AI:</strong> Could not connect to the server.";

    }

    chatBox.scrollTop = chatBox.scrollHeight;
}