import { useContext, useEffect, useState } from "react";
import type { KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../Config/Api";
import { AuthContext } from "../Context/AuthContext";
import type { ChatMessage } from "../Config/Types";
import "../Css/Pages/Chat.css"

export default function Chat() {
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();

    if (!authContext) throw new Error("AuthContext.Provider is required.");

    const { user } = authContext;
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [prompt, setPrompt] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingMessages, setLoadingMessages] = useState(true);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        const access = localStorage.getItem("access");
        if (!access) {
            navigate("/login");
            return;
        }

        if (!user) return;

        const loadMessages = async () => {
            setLoadingMessages(true);
            try {
                const data = await API<ChatMessage[]>("GET", `/system/chat/user/${user.id}`);
                setMessages([...data]);
            } catch (error) {
                setMessage("Unable to load chat history.");
            } finally {
                setLoadingMessages(false);
            }
        };

        loadMessages();
    }, [navigate, user]);

    const handleSend = async () => {
        if (!prompt.trim() || !user) {
            setMessage("Enter a question first.");
            return;
        }

        const currentQuery = prompt.trim();
        setPrompt("");
        setMessage(null);
        setLoading(true);

        const optimisticMsg: ChatMessage = {
            id: `temp-${Date.now()}`,
            user_query: currentQuery,
            ai_response: "Analyzing records...",
            chat_mode: "gemini",
            created_at: new Date().toISOString(),
            session_id: "temp"
        };
        setMessages(prev => [...prev, optimisticMsg]);

        try {
            const payload = {
                user_query: currentQuery,
                chat_mode: "gemini",
            };
            const reply = await API<ChatMessage>("POST", "/system/chat", payload);

            setMessages(prev => prev.map(m => m.id === optimisticMsg.id ? reply : m));
        } catch (error) {
            setMessages(prev => prev.filter(m => m.id !== optimisticMsg.id));
            setPrompt(currentQuery);
            setMessage("Unable to send message.");
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            if (!loading) handleSend();
        }
    };

    return (
        <div className="chat-page-container">
            <header className="chat-page-header">
                <div className="header-meta">
                    <h1 className="chat-page-title">MedBrief AI</h1>
                    <p className="chat-page-subtitle">Ask your assistant about medical records, prescriptions, or clinical insights.</p>
                </div>
            </header>

            <div className="chat-window-frame">
                <div className="chat-history-viewport">
                    {loadingMessages ? (
                        <div className="chat-status-alert">
                            <i className="ti ti-loader-quarter chat-spinner" />
                            <p>Reading secure clinical logs…</p>
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="chat-status-alert empty">
                            <i className="ti ti-message-chatbot alert-icon" />
                            <h3>No Active Consultation</h3>
                            <p>Send a clinical diagnostic statement below to start your session history.</p>
                        </div>
                    ) : (
                        <div className="chat-dialog-stream">
                            {messages.map(msg => (
                                <div key={msg.id ?? `${msg.session_id}-${msg.created_at}`} className="dialog-block-pair">

                                    <div className="bubble-wrapper user">
                                        <div className="speech-bubble user">
                                            {msg.user_query}
                                        </div>
                                    </div>

                                    <div className="bubble-wrapper ai">
                                        <div className="ai-avatar">MB</div>
                                        <div className={`speech-bubble ai ${msg.id?.toString().startsWith("temp-") ? "typing-state" : ""}`}>
                                            {msg.ai_response}
                                            {msg.created_at && !msg.id?.toString().startsWith("temp-") && (
                                                <span className="bubble-timestamp">
                                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="chat-input-dock">
                    {message && <div className="chat-error-toast">{message}</div>}
                    <div className="input-bar-group">
                        <textarea
                            className="dock-textarea"
                            rows={1}
                            value={prompt}
                            onChange={e => setPrompt(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask MedBrief... (Press ⌘ + Enter to send)"
                        />
                        <button
                            type="button"
                            className="dock-send-btn"
                            onClick={handleSend}
                            disabled={loading || !prompt.trim()}
                            aria-label="Send Message"
                        >
                            {loading ? (
                                <i className="ti ti-loader-quarter chat-spinner" />
                            ) : (
                                <i className="ti ti-arrow-up" />
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}