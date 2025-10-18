import React, { useState } from "react";
import { MessageCircle, Send, X, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils"; // optional helper if you use it

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Hello! I am Ura assistant. How can I help you today?",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");

  const quickReplies = [
    "How do I create an account?",
    "Payment Issues",
    "Business Verification",
    "Technical Support",
    "Contact human agent",
  ];

  const sendMessage = (text?: string) => {
    const messageText = text ?? input.trim();
    if (!messageText) return;

    const newMessage = {
      from: "user",
      text: messageText,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    // You could hook up a backend API or AI response here
  };

  if (!isOpen)
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-orange-500 text-white p-4 rounded-full shadow-lg hover:bg-orange-600 transition"
        aria-label="Open chat"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    );

  return (
    <div className="fixed bottom-6 right-6 w-80 bg-white rounded-xl shadow-2xl overflow-hidden border border-orange-100">
      {/* Header */}
      <div className="bg-orange-500 text-white flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="bg-white text-orange-500 font-semibold w-8 h-8 flex items-center justify-center rounded-full">
            UA
          </div>
          <div>
            <p className="font-medium">Ura Assistant</p>
            <p className="text-xs text-green-200">Online</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMessages([])}
            className="hover:opacity-80 transition"
            aria-label="Refresh chat"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="hover:opacity-80 transition"
            aria-label="Close chat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 space-y-4 h-80 overflow-y-auto bg-gray-50">
        {messages.map((msg, i) => (
          <div key={i} className={cn("flex flex-col", msg.from === "user" && "items-end")}>
            <div
              className={cn(
                "px-4 py-2 rounded-lg text-sm max-w-[80%]",
                msg.from === "bot"
                  ? "bg-gray-200 text-gray-800"
                  : "bg-orange-500 text-white"
              )}
            >
              {msg.text}
            </div>
            <span className="text-xs text-gray-400 mt-1">{msg.time}</span>
          </div>
        ))}

        {/* Quick replies */}
        <div className="flex flex-wrap gap-2 pt-2">
          {quickReplies.map((q) => (
            <button
              key={q}
              onClick={() => sendMessage(q)}
              className="border border-orange-400 text-orange-500 text-xs rounded-full px-3 py-1 hover:bg-orange-50 transition"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-3 flex items-center gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything..."
          className="flex-1 text-sm bg-orange-50 border-none focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        <button
          onClick={() => sendMessage()}
          className="text-orange-500 hover:text-orange-600 transition"
          aria-label="Send message"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
