import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const PLATFORM_CONTEXT = `You are Planora Assistant, a helpful AI chatbot for Planora, an event management platform based in Bangladesh.

Planora features:
- Users can create public/private events, manage participants, send invitations, collect payments, and write reviews.
- Events can be free or paid. Payment is handled via SSLCommerz.
- Dashboard for users to track their events, participations, invitations, and reviews.
- Admin dashboard for platform management, user management, and analytics.
- AI-powered search for finding relevant events.

When answering:
- Be friendly, concise, and helpful.
- If asked about events, suggest checking the Events page or using the AI search bar.
- If asked about creating events, guide them to sign up and go to Dashboard > My Events > Create Event.
- If asked about payments, explain that Planora supports SSLCommerz for secure transactions.
- If the user asks for specific event recommendations, provide general suggestions and encourage using search.
- If you don't know something, say "I'm not sure about that, but you can contact support@planora.com for help."
- Keep responses under 150 words.`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages" }, { status: 400 });
    }

    const formattedMessages = messages
      .filter((m: any) => m?.content?.trim?.())
      .map((m: any) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: String(m.content).trim(),
      }));

    while (formattedMessages.length > 0 && formattedMessages[0].role !== "user") {
      formattedMessages.shift();
    }

    const dedupedMessages: { role: string; content: string }[] = [];
    for (const msg of formattedMessages) {
      if (
        dedupedMessages.length === 0 ||
        dedupedMessages[dedupedMessages.length - 1].role !== msg.role
      ) {
        dedupedMessages.push(msg);
      } else {
        dedupedMessages[dedupedMessages.length - 1].content += "\n" + msg.content;
      }
    }

    if (dedupedMessages.length === 0) {
      return NextResponse.json({ response: "I didn't receive a message. Please try again." });
    }

    try {
      // Build Gemini chat history (all but the last user message)
      const history = dedupedMessages.slice(0, -1).map((m) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      }));

      const lastMessage = dedupedMessages[dedupedMessages.length - 1].content;

      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash-latest",          // separate free quota from 2.0-flash
        systemInstruction: PLATFORM_CONTEXT, // proper system prompt support
      });

      const chat = model.startChat({ history });
      const result = await chat.sendMessage(lastMessage);
      const response = result.response.text();

      return NextResponse.json({ response });

    } catch (aiError: any) {
      console.error("Gemini error:", aiError.message);

      const lastUserMessage =
        messages.filter((m: any) => m.role === "user").pop()?.content?.toLowerCase() || "";

      let fallback = "I'm having trouble connecting. Please try again later or contact support@planora.com.";

      if (lastUserMessage.includes("event") || lastUserMessage.includes("find")) {
        fallback = "You can browse all events on the Events page. Use the AI search bar with keywords like 'tech meetup' or 'music festival'!";
      } else if (lastUserMessage.includes("create") || lastUserMessage.includes("host")) {
        fallback = "To create an event, sign up or log in, then go to your Dashboard and click 'Create Event'.";
      } else if (lastUserMessage.includes("payment") || lastUserMessage.includes("pay")) {
        fallback = "Planora uses SSLCommerz for secure payments. You can pay during event registration.";
      } else if (lastUserMessage.includes("help") || lastUserMessage.includes("support")) {
        fallback = "I'm here to help! Ask me about events, creating events, or using Planora.";
      }

      return NextResponse.json({ response: fallback, fallback: true });
    }

  } catch (error) {
    console.error("AI chat error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}