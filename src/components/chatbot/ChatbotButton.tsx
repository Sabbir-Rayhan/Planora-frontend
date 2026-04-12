"use client";

import { useChatbot } from "@/context/ChatbotContext";
import { MessageCircle, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import ChatbotWindow from "./ChatbotWindow";

export default function ChatbotButton() {
  const { isOpen, setIsOpen } = useChatbot();

  return (
    <>
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl flex items-center justify-center z-50 hover:scale-110 transition-transform group"
        aria-label="Open AI Chat"
      >
        {isOpen ? (
          <MessageCircle className="w-6 h-6" />
        ) : (
          <>
            <MessageCircle className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </span>
          </>
        )}
        <span className="absolute right-full mr-3 px-3 py-1.5 bg-slate-800 dark:bg-slate-700 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          AI Assistant
        </span>
      </motion.button>

      <ChatbotWindow />
    </>
  );
}