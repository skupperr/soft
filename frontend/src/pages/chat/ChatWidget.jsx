import { useNavigate } from "react-router-dom";
import React, { useState, useRef, useEffect } from "react";

import { motion, AnimatePresence } from "framer-motion";
import { FiMaximize2 } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
import { useChat } from "./ChatContext";

function ChatWidget() {

    const [isOpen, setIsOpen] = useState(false);
    // const [messages, setMessages] = useState([
    //     { sender: "ai", text: "Hi 👋 How can I help you today?" },
    // ]);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef(null);
    // const [isTyping, setIsTyping] = useState(false);
    const navigate = useNavigate();
    const { messages, setMessages, isTyping, setIsTyping } = useChat();

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);



    const handleSend = (e) => {
        e.preventDefault();
        setInput("")
        if (!input.trim()) return;

        const userMessage = { sender: "user", text: input };
        setMessages((prev) => [...prev, userMessage]);

        setTimeout(() => {
            const aiText = "This is a sample AI response with typing effect.";
            setIsTyping(true);

            let i = 0;
            const typingInterval = setInterval(() => {
                i++;
                setMessages((prev) => [
                    ...prev.slice(0, -1),
                    { sender: "ai", text: aiText.slice(0, i) }
                ]);

                if (i === aiText.length) {
                    clearInterval(typingInterval);
                    setIsTyping(false);
                }
            }, 40); // typing speed (ms per character)

            // push a placeholder AI message first
            setMessages((prev) => [...prev, { sender: "ai", text: "" }]);
        }, 800);

    };
    return (
        <div>

            {/* Floating Chat Button */}
            {location.pathname !== "/chat" && (
                <>
                    <button
                        aria-label="Open chat"
                        onClick={() => setIsOpen((prev) => !prev)}
                        className="fixed bottom-6 right-6 size-14 rounded-full bg-[#5fd068] text-white shadow-lg flex items-center justify-center text-2xl hover:bg-[#4b8673] transition"
                    >
                        🤖
                    </button>

                    {/* Animated Chat Dialog */}
                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 50, scale: 0.9 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                                className="fixed bottom-24 right-6 w-96 h-128 bg-[#f7fcf7] shadow-2xl rounded-2xl flex flex-col overflow-hidden border border-[#e0f0e5]"
                            >
                                {/* Header */}
                                <div className="flex justify-between items-center px-4 py-2 bg-[#4b8673] text-white">
                                    <span className="font-semibold">AI Assistant</span>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => { setIsOpen(false), navigate("/chat") }}
                                            aria-label="Maximize chat"
                                            className="text-lg font-bold hover:text-[#5fd068] transition"
                                        >
                                            <FiMaximize2 />
                                        </button>
                                        <button
                                            onClick={() => setIsOpen(false)}
                                            aria-label="Close chat"
                                            className="text-lg font-bold hover:text-[#5fd068] transition"
                                        >
                                            <RxCross2 fontSize={25} />
                                        </button>
                                    </div>
                                </div>

                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2 text-[#0e1f0f]">
                                    <AnimatePresence initial={false}>
                                        {messages.map((msg, idx) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.2 }}
                                                className={`w-fit max-w-[75%] px-3 py-2 rounded-2xl text-sm shadow-sm break-words ${msg.sender === "user"
                                                    ? "bg-[#5fd068] text-white self-end ml-auto"
                                                    : "bg-white border border-[#d8eedd] text-[#0e1f0f]"
                                                    }`}
                                            >
                                                {msg.text}
                                            </motion.div>
                                        ))}

                                        {isTyping && (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="bg-[#eaf7f0] text-[#4b8673] px-3 py-2 rounded-2xl text-sm inline-block shadow-sm"
                                            >
                                                typing<span className="animate-pulse">...</span>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Input */}
                                <form
                                    onSubmit={handleSend}
                                    className="flex items-center border-t border-[#d8eedd] bg-white px-2 py-2 gap-2"
                                >
                                    <input
                                        type="text"
                                        aria-label="Type your message"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        className="flex-1 border border-[#cfe9d8] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#5fd068] placeholder-gray-400"
                                        placeholder="Type a message..."
                                    />
                                    <button
                                        type="submit"
                                        className="px-3 py-2 rounded-lg bg-[#5fd068] text-white hover:bg-[#4b8673] transition shadow"
                                    >
                                        ➤
                                    </button>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence></>

            )}

        </div>
    );
}

export default ChatWidget;
