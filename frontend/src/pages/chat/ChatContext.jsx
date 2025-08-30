import { createContext, useContext, useState } from "react";

const ChatContext = createContext();

export function ChatProvider({ children }) {
  const [messages, setMessages] = useState([
    { sender: "ai", text: "Hi 👋 How can I help you today?" },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  return (
    <ChatContext.Provider value={{ messages, setMessages, isTyping, setIsTyping }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  return useContext(ChatContext);
}
