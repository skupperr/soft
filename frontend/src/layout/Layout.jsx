import React, { useState } from "react";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { Outlet, Link, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export function Layout() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "ai", text: "Hi 👋 How can I help you today?" },
  ]);
  const [input, setInput] = useState("");

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    // Simulated AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "This is a sample AI response." },
      ]);
    }, 800);

    setInput("");
  };

  return (
    <div className="app-layout">
      {/* Header (unchanged) */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f0f2f4] px-10 py-3 bg-white">
        <div className="flex items-center gap-4 text-[#111418]">
          <h2 className="text-[#111418] text-lg font-bold leading-tight tracking-[-0.015em]">
            LifeLens
          </h2>
        </div>
        <div className="flex flex-1 justify-end gap-8">
          <div className="flex items-center gap-9">
            <SignedIn>
              <Link to="/">
                <div className="text-[#111418] text-sm font-medium leading-normal">
                  Dashboard
                </div>
              </Link>
              <Link to="/meal-plan">
                <div className="text-[#111418] text-sm font-medium leading-normal">
                  Food & Planning
                </div>
              </Link>
              <Link to="/manage-day">
                <div className="text-[#111418] text-sm font-medium leading-normal">
                  Manage Day
                </div>
              </Link>
              <Link to="/">
                <div className="text-[#111418] text-sm font-medium leading-normal">
                  Finance
                </div>
              </Link>
              <UserButton />
            </SignedIn>
          </div>
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
            style={{ backgroundImage: `url("...your image url...")` }}
          ></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="app-main pt-16">
        <SignedOut>
          <Navigate to="/sign-in" replace />
        </SignedOut>
        <SignedIn>
          <Outlet />
        </SignedIn>
      </main>

      {/* Floating Chat Button */}
      <button
        aria-label="Open chat"
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-6 right-6 size-14 rounded-full bg-blue-600 text-white shadow-lg flex items-center justify-center text-2xl hover:bg-blue-700 transition"
      >
        💬
      </button>

      {/* Animated Chat Dialog */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-24 right-6 w-80 h-96 bg-white shadow-xl rounded-2xl flex flex-col overflow-hidden border border-gray-200"
          >
            {/* Header */}
            <div className="flex justify-between items-center px-4 py-2 bg-blue-600 text-white">
              <span className="font-semibold">AI Assistant</span>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
                className="text-lg font-bold"
              >
                ×
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`max-w-[75%] px-3 py-2 rounded-lg text-sm ${
                    msg.sender === "user"
                      ? "bg-blue-500 text-white self-end ml-auto"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            {/* Input */}
            <form
              onSubmit={handleSend}
              className="flex items-center border-t px-2 py-2 gap-2"
            >
              <input
                type="text"
                aria-label="Type your message"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Type a message..."
              />
              <button
                type="submit"
                className="px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                ➤
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
