import { useState } from "react";

export default function ChatWidget() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMsg = input;

        setMessages(prev => [...prev, { role: "user", text: userMsg }]);
        setInput("");
        setLoading(true);

        try {
            const res = await fetch("https://chatbotai-wypy.onrender.com/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    client_id: "test",
                    message: userMsg,
                    history: messages
                        .filter(m => m.role === "user" || m.role === "bot")
                        .reduce((acc, curr, i, arr) => {
                            if (curr.role === "user") {
                                acc.push({
                                    user: curr.text,
                                    bot: arr[i + 1]?.text || ""
                                });
                            }
                            return acc;
                        }, [])
                })
            });

            const text = await res.text();
            console.log(text);

            let data;
            try {
                data = JSON.parse(text);
            } catch {
                throw new Error("Invalid JSON response");
            }

            if (data.error) {
                setMessages(prev => [
                    ...prev,
                    { role: "bot", text: "" }
                ]);
            } else {
                setMessages(prev => [
                    ...prev,
                    { role: "bot", text: data.bot_response }
                ]);
            }

        } catch (err) {
            setMessages(prev => [
                ...prev,
                { role: "bot", text: "حصل خطأ" }
            ]);
        }

        setLoading(false);
    };

    return (
        <>
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
                    <div style={{
                        background: "#111",
                        color: "#fff",
                        padding: 10,
                        fontWeight: "bold"
                    }}>
                        AI Assistant
                    </div>

                    <div style={{ flex: 1, padding: 10, overflowY: "auto" }}>
                        {messages.map((m, i) => (
                            <div key={i} style={{ marginBottom: 8 }}>
                                <b>{m.role === "user" ? "You" : "Bot"}:</b> {m.text}
                            </div>
                        ))}

                        {loading && <div>Typing...</div>}
                    </div>

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