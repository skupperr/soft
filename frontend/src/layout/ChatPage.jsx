import '../index.css';
import { RiRobot3Fill } from "react-icons/ri";

function ChatPage() {
    return (
        <>
            <link
                href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap"
                rel="stylesheet"
            />
            <link
                href="https://fonts.googleapis.com/icon?family=Material+Icons"
                rel="stylesheet"
            />
            <style>{`
  /* Hide scrollbar but keep wheel/trackpad scrolling */
  #message-input.no-scrollbar {
    -ms-overflow-style: none;      /* IE/Edge */
    scrollbar-width: none;         /* Firefox */
    overscroll-behavior: contain;  /* prevent parent scroll on overscroll */
  }
  #message-input.no-scrollbar::-webkit-scrollbar { 
    width: 0; height: 0;           /* Chrome/Safari */
  }
`}</style>


            <div className="h-screen bg-background text-text flex">
                {/* ✅ Fixed Sidebar */}
                <div className="fixed left-0  h-full w-[20%] bg-gradient-to-b from-secondary/10 to-background border-r border-secondary/20 flex flex-col">
                    <div className="p-6 pb-0">
                        <div className="flex items-center mb-8">
                            <div className="bg-custom-primary p-2 rounded-lg mr-4">
                                <RiRobot3Fill size={30} />
                            </div>
                            <div>
                                <h1 className="font-bold text-xl">FinanceBot AI</h1>
                                <p className="text-sm text-gray-400">Smart Money Assistant</p>
                            </div>
                        </div>
                        <button className="mb-8 w-full bg-primary hover:bg-primary/90 text-background font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2">
                            <span className="material-icons">add</span>
                            New Chat
                        </button>
                    </div>
                    <div className="border-b border-secondary/20"></div>
                    <div className="p-6 flex-1 overflow-y-auto scrollbar-hide space-y-4">
                        <div className="chat-history-item hover:bg-secondary/20 p-3 rounded-lg cursor-pointer transition-colors">
                            <div className="text-sm font-medium text-text">Budget Analysis Q4</div>
                        </div>
                        <div className="chat-history-item hover:bg-secondary/10 p-3 rounded-lg cursor-pointer transition-colors">
                            <div className="text-sm font-medium text-text">Savings Plan Review</div>
                        </div>
                        <div className="chat-history-item hover:bg-secondary/10 p-3 rounded-lg cursor-pointer transition-colors bg-secondary/10 border-l-2 border-primary">
                            <div className="text-sm font-medium text-text">Monthly Budget Setup</div>
                        </div>
                        <div className="chat-history-item hover:bg-secondary/10 p-3 rounded-lg cursor-pointer transition-colors">
                            <div className="text-sm font-medium text-text">Expense Categories</div>
                        </div>
                    </div>
                </div>

                {/* ✅ Main Chat Area (shifted right because sidebar is fixed) */}
                <div className="ml-[20%] flex-1 flex flex-col">
                    {/* Messages */}
                    <main className="flex-1 p-6 overflow-y-auto">
                        <div className="space-y-8">
                            {/* Bot message */}
                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                                    <RiRobot3Fill color="black" />
                                </div>
                                <div className="bg-secondary/10 bg-opacity-50 p-4 rounded-2xl rounded-tl-sm max-w-2xl">
                                    <p>👋 Hi 👋 How can I help you today?</p>
                                </div>
                            </div>

                            {/* User message */}
                            <div className="flex items-start gap-4 justify-end">
                                <div className="bg-primary text-[#0e1f0f] p-4 max-w-2xl rounded-2xl rounded-tr-sm">
                                    <p>
                                        I want to analyze my spending patterns from last month and get
                                        suggestions for better budgeting.
                                    </p>
                                </div>
                                <img
                                    alt="User avatar"
                                    className="w-10 h-10 rounded-full"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZIvfU_5fpV-aFTHJ0RZqvbPJ2ew6OYHNcyxQ1Sxf52yXV1SSvFa-OhPa3wQ1wDssU1IrZU-ClI_Ab0VDS5iu7ygvjYIX-U_IxKSRHqgiyPhNmi10PE9DgoUd4vi8p6-8gjDO6t7hVjXF-ZOG4pQ4aB2AjvY-ygRB6B8EtQp-rPm9itqFCXf3ZQNTm917AuuNotYMLdfzQeNeD5jjm4svcvthQXxpnb1ZFnxgy6ZyCu8F7ZfjlEgNRnx0f0UMxCJMQ2sAWXxUH7rI"
                                />
                            </div>

                            {/* Typing indicator */}
                            <div className="flex items-start gap-4">
                                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                                    <RiRobot3Fill color="black" />
                                </div>
                                <div className="bg-ai-chat-bg bg-opacity-50 p-4 rounded-2xl rounded-tl-sm">
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-200" />
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-400" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>

                    {/* ✅ Fixed Input Box (aligned with chat area, not sidebar) */}
                    <div
                        id="input-area"
                        className="fixed bottom-0 left-[20%] w-[80%] border-t border-secondary/20 bg-background p-4"
                    >
                        <div className="flex items-end space-x-3 max-w-4xl mx-auto relative">
                            {/* Attach */}
                            <button className="p-3 text-text/60 hover:text-text hover:bg-secondary/10 rounded-lg transition-colors">
                                📎
                            </button>

                            {/* ✅ Auto-resizing textarea */}
                            <textarea
                                id="message-input"
                                placeholder="Ask me about budgeting, savings, or expense analysis..."
                                className="no-scrollbar w-full bg-secondary/10 border border-secondary/20 rounded-2xl px-4 py-3 pr-12 
             text-text placeholder-text/50 focus:outline-none focus:ring-2 focus:ring-primary 
             focus:border-transparent resize-none overflow-y-auto break-words whitespace-pre-wrap"
                                rows={1}
                                spellCheck="false"
                                style={{
                                    minHeight: "48px",  // 1 line
                                    maxHeight: "160px"  // ~5 lines cap (adjust as you like)
                                }}
                                onInput={(e) => {
                                    e.target.style.height = "48px"; // reset to min
                                    e.target.style.height = Math.min(e.target.scrollHeight, 160) + "px"; // grow up to max
                                }}
                            />


                            {/* Send */}
                            <button
                                id="send-btn"
                                className="absolute right-5 bottom-2 w-8 h-8 bg-primary hover:bg-primary/90 text-background rounded-lg flex items-center justify-center transition-colors"
                            >
                                ➤
                            </button>
                        </div>

                        <div className="text-center mt-2">
                            <p className="text-xs text-text/40">
                                AI can make mistakes. Consider checking important information.
                            </p>
                        </div>
                    </div>


                </div>
            </div>
        </>
    );

}

export default ChatPage;