<template>
    <div class="chat-container">
        <div class="messages">
            <div v-for="(message, index) in messages" :key="index" :class="message.sender">
                <p>{{ message.text }}</p>
            </div>
        </div>
        <div class="input-container">
            <input
                v-model="userInput"
                @keyup.enter="sendMessage"
                type="text"
                placeholder="Escribe tu mensaje..."
            />
            <button @click="sendMessage">Enviar</button>
        </div>
    </div>
</template>

<script>
const { url } = require('../../api_config.js')
const axios = require('axios')
axios.defaults.baseURL = url
export default {
    name: "ChatView",
    data() {
        return {
            messages: [],
            userInput: "",
        };
    },
    methods: {
        async sendMessage() {
            if (this.userInput.trim() === "") return;

            // Add user message to the chat
            this.messages.push({ text: this.userInput, sender: "user" });

            const userMessage = this.userInput;
            this.userInput = "";

            try {
                // Call the API to get the bot response
                const response = await axios.post("https://api.example.com/chat", {
                    message: userMessage,
                });

                // Add bot response to the chat
                this.messages.push({ text: response.data.reply, sender: "bot" });
            } catch (error) {
                console.error("Error fetching bot response:", error);
                this.messages.push({
                    text: "Lo siento, hubo un error al obtener la respuesta.",
                    sender: "bot",
                });
            }
        },
    },
};
</script>

<style scoped>
.chat-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    max-width: 600px;
    margin: 0 auto;
    border: 1px solid #ccc;
    border-radius: 8px;
    overflow: hidden;
}

.messages {
    flex: 1;
    padding: 10px;
    overflow-y: auto;
    background-color: #f9f9f9;
}

.messages .user {
    text-align: right;
    margin: 5px 0;
}

.messages .bot {
    text-align: left;
    margin: 5px 0;
}

.messages p {
    display: inline-block;
    padding: 10px;
    border-radius: 8px;
    max-width: 70%;
}

.messages .user p {
    background-color: #d1e7dd;
    color: #0f5132;
}

.messages .bot p {
    background-color: #f8d7da;
    color: #842029;
}

.input-container {
    display: flex;
    padding: 10px;
    background-color: #fff;
    border-top: 1px solid #ccc;
}

input[type="text"] {
    flex: 1;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-right: 10px;
}

button {
    padding: 10px 20px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

button:hover {
    background-color: #0056b3;
}
</style>