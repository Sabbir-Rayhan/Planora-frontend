import { NextRequest, NextResponse } from 'next/server';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL; // Your existing backend URL

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();
    if (!query || query.trim().length < 2) {
      return NextResponse.json({ suggestions: [] });
    }

    let suggestions: string[] = [];
    let usingFallback = false;

    // 1. Try OpenRouter AI (if API key is configured)
    if (OPENROUTER_API_KEY) {
      try {
        const response = await fetch(OPENROUTER_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
            'X-Title': 'Planora Event Search',
          },
          body: JSON.stringify({
            model: 'mistralai/mistral-7b-instruct:free',
            messages: [
              {
                role: 'user',
                content: `Generate 5 short event search query suggestions based on the user's input. Return ONLY a JSON array of strings, nothing else. Input: "${query}"`,
              },
            ],
            max_tokens: 200,
            temperature: 0.7,
          }),
        });

        const data = await response.json();
        if (data.error) {
          console.error('OpenRouter error:', data.error);
          throw new Error(data.error.message);
        }

        const aiText = data.choices?.[0]?.message?.content || '';
        const jsonMatch = aiText.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          suggestions = JSON.parse(jsonMatch[0]);
        } else {
          suggestions = aiText.split('\n').filter((s: string) => s.trim().length > 0);
        }
        if (!Array.isArray(suggestions)) suggestions = [];
      } catch (aiError) {
        console.error('OpenRouter failed, using fallback:', aiError);
        usingFallback = true;
      }
    } else {
      usingFallback = true;
    }

    // 2. Fallback: fetch events from backend API and return titles that match query
    if (suggestions.length === 0 && BACKEND_API_URL) {
      try {
        const res = await fetch(`${BACKEND_API_URL}/events?search=${encodeURIComponent(query)}&limit=5`, {
          cache: 'no-store',
        });
        const data = await res.json();
        const events = data.data || [];
        suggestions = events.map((event: any) => event.title).slice(0, 5);
        usingFallback = true;
      } catch (fetchError) {
        console.error('Fallback event fetch failed:', fetchError);
        suggestions = [];
      }
    }

    return NextResponse.json({ suggestions, fallback: usingFallback });
  } catch (error) {
    console.error('Search endpoint error:', error);
    return NextResponse.json(
      { suggestions: [], error: 'Search unavailable' },
      { status: 500 }
    );
  }
}