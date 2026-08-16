const input = document.getElementById("message-input");
const button = document.getElementById("send-button");
const chatBox = document.getElementById("chat-box");

button.addEventListener("click", sendMessage);

input.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});

function sendMessage() {

    const message = input.value.trim();

    if (message === "") {
        return;
    }

    const userMessage = document.createElement("div");

    userMessage.className = "message user";

    userMessage.innerHTML = `<strong>You:</strong> ${message}`;

    chatBox.appendChild(userMessage);

    input.value = "";

    chatBox.scrollTop = chatBox.scrollHeight;
}