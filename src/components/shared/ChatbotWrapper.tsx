"use client";

import { ChatbotProvider } from "@/context/ChatbotContext";
import ChatbotButton from "@/components/chatbot/ChatbotButton";

export default function ChatbotWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ChatbotProvider>
      {children}
      <ChatbotButton />
    </ChatbotProvider>
  );
}