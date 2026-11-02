import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
ArrowLeft,
Send,
Mic,
Volume2,
Trash2,
Bot,
User,
} from "lucide-react";
import api from "../services/api";

export default function Assistant() {
const [messages, setMessages] = useState([
{
role: "assistant",
text: "Hello! 👋 I'm VoxMate AI.How can I Help you today?",
},
]);

const [input, setInput] = useState("");
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
const [listening, setListening] = useState(false);

const bottomRef = useRef(null);
const recognitionRef = useRef(null);

useEffect(() => {
bottomRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages, loading]);

useEffect(() => {
return () => {
recognitionRef.current?.stop();
};
}, []);

const sendMessage = async (e) => {
e?.preventDefault();

const message = input.trim();
if (!message || loading) return;

setMessages((previous) => [
  ...previous,
  { role: "user", text: message },
]);

setInput("");
setError("");
setLoading(true);

try {
  const response = await api.post("/api/assistant/chat", { message });

  const reply =
    response.data.reply ||
    response.data.message ||
    "Sorry, mujhe response nahi mila.";

  setMessages((previous) => [
    ...previous,
    { role: "assistant", text: reply },
  ]);
} catch (err) {
  setError(
    err.response?.data?.message ||
      "AI se connect nahi ho pa raha. Backend aur API key check karo."
  );
} finally {
  setLoading(false);
}

};

const startVoiceInput = () => {
const SpeechRecognition =
window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
  setError("Voice input ke liye Chrome browser use karo.");
  return;
}

if (listening) {
  recognitionRef.current?.stop();
  setListening(false);
  return;
}

const recognition = new SpeechRecognition();
recognition.lang = "en-US";
recognition.interimResults = false;
recognition.continuous = false;

recognition.onstart = () => {
  setListening(true);
  setError("");
};

recognition.onresult = (event) => {
  const spokenText = event.results[0][0].transcript;
  setInput((previous) =>
    previous ? `${previous} ${spokenText}` : spokenText
  );
};

recognition.onerror = () => {
  setError("Microphone kaam nahi kar raha. Permission check karo.");
  setListening(false);
};

recognition.onend = () => {
  setListening(false);
};

recognitionRef.current = recognition;
recognition.start();

};

const speakMessage = (text) => {
if (!("speechSynthesis" in window)) {
setError("Is browser mein voice output supported nahi hai.");
return;
}

window.speechSynthesis.cancel();

const speech = new SpeechSynthesisUtterance(text);
speech.lang = "en-US";
speech.rate = 1;
window.speechSynthesis.speak(speech);

};

const clearChat = () => {
window.speechSynthesis?.cancel();

setMessages([
  {
    role: "assistant",
    text: "Chat clear ho gayi! 😊 Batao, main aapki kya help kar sakta hoon?",
  },
]);

setError("");

};

return (
<div className="page-container">
<header className="topbar">
<Link to="/dashboard" className="back-link">
<ArrowLeft size={18} /> Dashboard
</Link>

    <h2>VoxMate AI</h2>

    <button className="clear-chat-btn" onClick={clearChat}>
      <Trash2 size={17} /> Clear Chat
    </button>
  </header>

  <main className="assistant-container">
    <div className="assistant-heading">
      <div className="bot-avatar">
        <Bot size={30} />
      </div>

      <div>
        <h1>AI Assistant</h1>
        <p className="subtitle">Your personal AI companion</p>
      </div>
    </div>

    <section className="chat-box">
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div
            className={`chat-message ${message.role}`}
            key={`${index}-${message.role}`}
          >
            <div className="message-avatar">
              {message.role === "assistant" ? (
                <Bot size={18} />
              ) : (
                <User size={18} />
              )}
            </div>

            <div className="message-content">
              <p>{message.text}</p>

              {message.role === "assistant" && (
                <button
                  className="speak-btn"
                  onClick={() => speakMessage(message.text)}
                  title="Listen to response"
                  type="button"
                >
                  <Volume2 size={16} /> Listen
                </button>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="typing-indicator">
            VoxMate AI is thinking...
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {error && <p className="error-message chat-error">{error}</p>}

      <form className="chat-input-area" onSubmit={sendMessage}>
        <button
          type="button"
          className={`voice-btn ${listening ? "listening" : ""}`}
          onClick={startVoiceInput}
          title="Speak your message"
        >
          <Mic size={21} />
        </button>

        <input
          type="text"
          placeholder={
            listening ? "Sun raha hoon..." : "Message type karo..."
          }
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />

        <button
          type="submit"
          className="send-btn"
          disabled={loading || !input.trim()}
          title="Send message"
        >
          <Send size={20} />
        </button>
      </form>
    </section>

    <p className="voice-hint">
      🎙️ Mic dabao, apna sawaal bolo, phir Send dabao.
    </p>
  </main>
</div>

);
}