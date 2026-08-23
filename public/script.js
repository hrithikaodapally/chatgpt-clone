const input = document.getElementById("message-input");
const button = document.getElementById("send-button");
const chatBox = document.getElementById("chat-box");
const clearButton = document.getElementById("clear-chat");
const darkModeButton = document.getElementById("dark-mode");
// Store conversation history
let conversation = [];

button.addEventListener("click", sendMessage);

clearButton.addEventListener("click", function() {
    conversation = [];

    chatBox.innerHTML = `
        <div class="message bot">
            <strong>AI:</strong> Hello! How can I help you?
        </div>
    `;
    localStorage.removeItem("chatHistory");
});
darkModeButton.addEventListener("click", function() {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        darkModeButton.textContent = "☀️ Light";
    } else {
        darkModeButton.textContent = "🌙 Dark";
    }
});

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

    // Disable button while AI is responding
    button.disabled = true;
    button.textContent = "Thinking...";

    // Add user's message to conversation history
    conversation.push({
        role: "user",
        content: message
    });

    // Show user's message
    const userMessage = document.createElement("div");

    userMessage.className = "message user";

    userMessage.innerHTML =
        `<strong>You:</strong> ${message}`;

    chatBox.appendChild(userMessage);
    saveChat();

    input.value = "";

    chatBox.scrollTop = chatBox.scrollHeight;

    // Show loading message
    const loadingMessage = document.createElement("div");

    loadingMessage.className = "message bot";

    loadingMessage.innerHTML =
        "<strong>AI:</strong> Thinking...";

    chatBox.appendChild(loadingMessage);

    chatBox.scrollTop = chatBox.scrollHeight;

    try {

        const response = await fetch("/api/chat", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                conversation: conversation
            })
        });

        const data = await response.json();

        if (data.reply) {

            // Add AI response to conversation history
            conversation.push({
                role: "assistant",
                content: data.reply
            });

            loadingMessage.innerHTML =
                `<strong>AI:</strong> ${data.reply}`;
            saveChat();

        } else {

            loadingMessage.innerHTML =
                "<strong>AI:</strong> Sorry, I couldn't generate a response.";

        }

    } catch (error) {

        console.error(error);

        loadingMessage.innerHTML =
            "<strong>AI:</strong> Could not connect to the server.";

    }

    // Enable button again
    button.disabled = false;
    button.textContent = "Send";

    input.focus();

    chatBox.scrollTop = chatBox.scrollHeight;
}
function saveChat() {
    localStorage.setItem("chatHistory", chatBox.innerHTML);
}
const savedChat = localStorage.getItem("chatHistory");

if (savedChat) {
    chatBox.innerHTML = savedChat;
    chatBox.scrollTop = chatBox.scrollHeight;
}