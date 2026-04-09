import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Smart fallback in case API fails
const eventKeywords: Record<string, string[]> = {
  tech: ['Tech Meetup', 'Technology Workshop', 'Tech Conference', 'Software Development Seminar', 'IT Career Fair'],
  web: ['Web Development Workshop', 'Web Design Bootcamp', 'Frontend Development', 'Full Stack Conference', 'Web3 Summit'],
  music: ['Music Concert', 'Live Music Night', 'Music Festival', 'Band Performance', 'Classical Music Evening'],
  food: ['Food Festival', 'Cooking Workshop', 'Street Food Fair', 'Chef Masterclass', 'Food & Culture Expo'],
  sport: ['Sports Tournament', 'Football Championship', 'Cricket League', 'Sports Day', 'Marathon Event'],
  cricket: ['Cricket Tournament', 'Cricket League Match', 'Cricket Training Camp', 'T20 Championship', 'Cricket Club Event'],
  football: ['Football Tournament', 'Football League', 'Football Training', 'Soccer Championship', 'Football Gala'],
  business: ['Business Summit', 'Startup Conference', 'Entrepreneurship Workshop', 'Business Networking', 'Investment Forum'],
  art: ['Art Exhibition', 'Photography Workshop', 'Art & Craft Fair', 'Creative Workshop', 'Design Showcase'],
  education: ['Educational Seminar', 'Learning Workshop', 'Career Guidance Session', 'Scholarship Fair', 'Academic Conference'],
  health: ['Health & Wellness Fair', 'Yoga Workshop', 'Medical Seminar', 'Fitness Challenge', 'Mental Health Awareness'],
  cultural: ['Cultural Festival', 'Cultural Night', 'Heritage Fair', 'Cultural Exchange', 'Traditional Dance Show'],
  birthday: ['Birthday Party', 'Birthday Celebration', 'Birthday Gala', 'Surprise Birthday Event', 'Kids Birthday Party'],
  wedding: ['Wedding Ceremony', 'Wedding Reception', 'Bridal Shower', 'Wedding Planning Workshop', 'Anniversary Celebration'],
  ramadan: ['Ramadan Iftar Party', 'Ramadan Gathering', 'Eid Celebration', 'Ramadan Night Event', 'Iftar Networking'],
  eid: ['Eid Celebration', 'Eid Gala Night', 'Eid Festival', 'Eid Reunion', 'Eid Cultural Show'],
  seminar: ['Career Seminar', 'Leadership Seminar', 'Professional Development Seminar', 'Academic Seminar', 'Tech Seminar'],
  workshop: ['Creative Workshop', 'Skill Development Workshop', 'Photography Workshop', 'Cooking Workshop', 'Leadership Workshop'],
  meetup: ['Tech Meetup', 'Developer Meetup', 'Designer Meetup', 'Startup Meetup', 'Community Meetup'],
  party: ['Networking Party', 'Rooftop Party', 'Pool Party', 'Garden Party', 'Corporate Party'],
  conference: ['Tech Conference', 'Business Conference', 'Academic Conference', 'Leadership Conference', 'Innovation Conference'],
  dhaka: ['Dhaka Tech Event', 'Dhaka Music Festival', 'Dhaka Food Fair', 'Dhaka Business Summit', 'Dhaka Cultural Night'],
  yoga: ['Yoga Workshop', 'Morning Yoga Session', 'Yoga Retreat', 'Mindfulness & Yoga', 'Yoga for Beginners'],
  career: ['Career Fair', 'Career Guidance Session', 'Job Fair', 'Career Development Workshop', 'Professional Networking'],
  startup: ['Startup Conference', 'Startup Pitch Night', 'Startup Networking', 'Startup Bootcamp', 'Entrepreneur Summit'],
  dance: ['Dance Performance', 'Dance Workshop', 'Cultural Dance Show', 'Dance Competition', 'Dance Night Event'],
  run: ['Running Marathon', 'Fun Run Event', 'Running Club Meetup', 'Run for Charity', 'Runner\'s Workshop'],
};

function getFallbackSuggestions(query: string): string[] {
  const lowerQuery = query.toLowerCase().trim();
  const suggestions = new Set<string>();

  for (const [keyword, events] of Object.entries(eventKeywords)) {
    if (keyword.includes(lowerQuery) || lowerQuery.includes(keyword)) {
      events.forEach(e => suggestions.add(e));
    }
  }

  if (suggestions.size < 3) {
    for (const [keyword, events] of Object.entries(eventKeywords)) {
      if (lowerQuery.length >= 2 && keyword.startsWith(lowerQuery.slice(0, 2))) {
        events.slice(0, 2).forEach(e => suggestions.add(e));
      }
    }
  }

  if (suggestions.size === 0) {
    const cap = query.charAt(0).toUpperCase() + query.slice(1);
    [`${cap} Event`, `${cap} Workshop`, `${cap} Conference`, `${cap} Meetup`, `${cap} Festival`]
      .forEach(e => suggestions.add(e));
  }

  return Array.from(suggestions).slice(0, 5);
}

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ suggestions: [] });
    }

    // Try Gemini AI first
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro-latest' });

      const prompt = `You are a search suggestion engine for an event management platform called Planora based in Bangladesh.

User typed: "${query}"

Generate exactly 5 smart, relevant event search suggestions.

Rules:
- Each suggestion must be a short event title (2-5 words)
- Make them relevant to what user typed
- Mix specific and general event types
- Consider Bangladesh context (Dhaka, Chittagong, local events)
- Return ONLY a valid JSON array of 5 strings
- No explanation, no markdown, just the JSON array

Example output: ["Tech Meetup Dhaka", "Technology Workshop", "IT Conference 2026", "Software Dev Seminar", "Coding Bootcamp"]

Output:`;

      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();

      // clean the response — remove markdown if present
      const cleaned = text
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();

      const suggestions = JSON.parse(cleaned);

      if (Array.isArray(suggestions) && suggestions.length > 0) {
        return NextResponse.json({
          suggestions: suggestions.slice(0, 5),
          source: 'gemini'
        });
      }

      throw new Error('Invalid response format');

    } catch (geminiError) {
      console.error('Gemini failed, using fallback:', geminiError);
      // use smart fallback
      const suggestions = getFallbackSuggestions(query);
      return NextResponse.json({ suggestions, source: 'fallback' });
    }

  } catch (error) {
    console.error('AI search error:', error);
    return NextResponse.json({ suggestions: [] });
  }
}