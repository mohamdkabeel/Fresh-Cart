import { useState } from "react";

export default function ChatWidget() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    const sendMessage = async () => {
        if (!input) return;

        const userMsg = input;

        setMessages([...messages, { role: "user", text: userMsg }]);
        setInput("");

        const res = await fetch("http://127.0.0.1:8000/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                client_id: "ecommerce_site",
                message: userMsg,
                history: []
            })
        });

        const data = await res.json();

        setMessages(prev => [
            ...prev,
            { role: "bot", text: data.bot_response }
        ]);
    };

    return (
        <>
            {/* زرار الشات */}
            <div
                onClick={() => setOpen(!open)}
                style={{
                    position: "fixed",
                    bottom: 20,
                    right: 20,
                    width: 55,
                    height: 55,
                    borderRadius: "50%",
                    background: "#111",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    zIndex: 9999
                }}
            >
                💬
            </div>

            {/* نافذة الشات */}
            {open && (
                <div
                    style={{
                        position: "fixed",
                        bottom: 90,
                        right: 20,
                        width: 320,
                        height: 420,
                        background: "#fff",
                        borderRadius: 12,
                        boxShadow: "0 0 20px rgba(0,0,0,0.2)",
                        display: "flex",
                        flexDirection: "column",
                        zIndex: 9999
                    }}
                >
                    {/* Header */}
                    <div style={{
                        background: "#111",
                        color: "#fff",
                        padding: 10,
                        fontWeight: "bold"
                    }}>
                        AI Assistant
                    </div>

                    {/* Messages */}
                    <div style={{ flex: 1, padding: 10, overflowY: "auto" }}>
                        {messages.map((m, i) => (
                            <div key={i} style={{ marginBottom: 8 }}>
                                <b>{m.role === "user" ? "You" : "Bot"}:</b> {m.text}
                            </div>
                        ))}
                    </div>

                    {/* Input */}
                    <div style={{ display: "flex", borderTop: "1px solid #ddd" }}>
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            style={{ flex: 1, padding: 10, border: "none" }}
                            placeholder="Type..."
                        />
                        <button onClick={sendMessage}>Send</button>
                    </div>
                </div>
            )}
        </>
    );
}