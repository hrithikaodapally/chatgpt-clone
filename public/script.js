const input = document.getElementById("message-input");
const button = document.getElementById("send-button");
const chatBox = document.getElementById("chat-box");
const clearButton = document.getElementById("clear-chat");
const newChatButton = document.getElementById("new-chat");
const darkModeButton = document.getElementById("dark-mode");

// Store conversation history
let conversation = [];

// Load saved conversation memory
const savedConversation = localStorage.getItem("conversation");

if (savedConversation) {
    conversation = JSON.parse(savedConversation);
}

// Send button
button.addEventListener("click", sendMessage);

// Clear Chat
clearButton.addEventListener("click", function() {
    conversation = [];

    localStorage.removeItem("conversation");
    localStorage.removeItem("chatHistory");

    chatBox.innerHTML = `
        <div class="message bot">
            <strong>AI:</strong> Hello! How can I help you?
        </div>
    `;

    input.value = "";
    input.focus();
});

// New Chat
newChatButton.addEventListener("click", function() {
    conversation = [];

    localStorage.removeItem("conversation");
    localStorage.removeItem("chatHistory");

    chatBox.innerHTML = `
        <div class="message bot">
            <strong>AI:</strong> Hello! How can I help you?
        </div>
    `;

    input.value = "";
    input.focus();
});

// Dark Mode
darkModeButton.addEventListener("click", function() {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        darkModeButton.textContent = "☀️ Light";
    } else {
        darkModeButton.textContent = "🌙 Dark";
    }
});

// Enter key → Send
input.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});

// Send message
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

    localStorage.setItem(
        "conversation",
        JSON.stringify(conversation)
    );

    // Show user's message
    const userMessage = document.createElement("div");

    userMessage.className = "message user";

    userMessage.innerHTML =
        `<strong>You:</strong> ${message}`;

    chatBox.appendChild(userMessage);

    // Save visible chat
    saveChat();

    // Clear input
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

        // Handle server errors
        if (!response.ok) {

            loadingMessage.innerHTML =
                `<strong>AI:</strong> ${data.error || "Something went wrong."}`;

        }

        // Handle successful AI response
        else if (data.reply) {

            // Add AI response to conversation history
            conversation.push({
                role: "assistant",
                content: data.reply
            });

            // Save conversation memory
            localStorage.setItem(
                "conversation",
                JSON.stringify(conversation)
            );

            // Display Markdown response
            loadingMessage.innerHTML =
                `<strong>AI:</strong> ${marked.parse(data.reply)}`;

            // Save visible chat
            saveChat();

        }

        // Handle empty response
        else {

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

// Save visible chat history
function saveChat() {
    localStorage.setItem(
        "chatHistory",
        chatBox.innerHTML
    );
}

// Load saved visible chat history
const savedChat = localStorage.getItem("chatHistory");

if (savedChat) {

    chatBox.innerHTML = savedChat;

    chatBox.scrollTop = chatBox.scrollHeight;

}