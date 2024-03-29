const sendChatBtn = document.querySelector(".send-btn");
const chatInput = document.querySelector(".chat-input textarea");
const chatbox = document.querySelector(".chatbox");
const chatBotToggler = document.querySelector(".chatbot-toggler");
const chatBotCloseBtn = document.querySelector(".close-btn");

let userMessage;
const API_KEY = "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";
const inputInitHeight =  chatInput.scrollHeight;


const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className)
    const chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
}

// Fetch data from OpenAI
const generateResponse = (incomingChatLi) => {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messageElement = incomingChatLi.querySelector("p");
    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
            "model": "gpt-3.5-turbo",
            "messages": [{role: "user", content: userMessage}],
        })
    }
    fetch(API_URL, requestOptions)
      .then(response => response.json())
      .then(data => {
        messageElement.textContent = data.choices[0].message.content;
      })
      .catch((error) => {
        messageElement.classList.add("error");
        messageElement.textContent = "Oops! Something went wrong, please try again!";
      })
      .finally(() => {
        chatbox.scrollTo(0, chatbox.scrollHeight);
      })
}

const handleChat = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage) return;
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);
    
    // Display incoming message from AI
    setTimeout(() => {
        const incomingChatLi = createChatLi("Thinking...", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600);
}

chatInput.addEventListener("keydown", (e) => {
    // Enable send using "enter" key on larger screens
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth < 800) {
        e.preventDefault();
        handleChat();
    }
});

chatInput.addEventListener("input", () => {
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
})

sendChatBtn.addEventListener("click", handleChat);
chatBotToggler.addEventListener("click", () => {
    document.body.classList.toggle("show-chatbot");
});

chatBotCloseBtn.addEventListener("click", () => {
    document.body.classList.remove("show-chatbot");
})