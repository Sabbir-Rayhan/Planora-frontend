import { Star, Quote } from "lucide-react";

interface ITestimonial {
  id: string;
  rating: number;
  comment: string;
  userName: string;
  eventTitle: string;
  date: string;
}

async function getTestimonials(): Promise<ITestimonial[]> {
  try {
    const apiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
    const res = await fetch(`${apiUrl}/reviews/testimonials?limit=3`, {
      next: { revalidate: 3600 },
    });
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Failed to fetch testimonials:", error);
    return [];
  }
}

const fallbackTestimonials: ITestimonial[] = [
  {
    id: "1",
    rating: 5,
    comment:
      "Planora streamlined our entire event management process. The participant approval system and real-time updates made coordinating our annual conference effortless.",
    userName: "Dr. Sarah Chen",
    eventTitle: "Tech Leadership Summit 2024",
    date: "2024-03-15T00:00:00Z",
  },
  {
    id: "2",
    rating: 5,
    comment:
      "As a community organizer, I've tried many platforms. Planora stands out with its intuitive interface and robust privacy controls for private events.",
    userName: "Marcus Thompson",
    eventTitle: "Neighborhood Art Walk",
    date: "2024-03-10T00:00:00Z",
  },
  {
    id: "3",
    rating: 5,
    comment:
      "The payment integration is seamless, and the dashboard analytics helped us understand attendee engagement better than any tool we've used before.",
    userName: "Elena Rodriguez",
    eventTitle: "Startup Pitch Night",
    date: "2024-03-05T00:00:00Z",
  },
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default async function Testimonials() {
  const testimonials = await getTestimonials();
  const displayTestimonials =
    testimonials.length > 0 ? testimonials : fallbackTestimonials;

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-slate-50 to-indigo-50/30 dark:from-slate-900 dark:to-indigo-950/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-indigo-600 dark:text-indigo-400 font-semibold text-sm uppercase tracking-wider">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100 mt-3">
            Trusted by Event Organizers
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-4 max-w-2xl mx-auto text-lg">
            See what our community members say about their experience with Planora.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayTestimonials.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-md border border-slate-100 dark:border-slate-700 hover:shadow-xl transition-shadow duration-300 flex flex-col"
            >
              <Quote className="w-8 h-8 text-indigo-200 dark:text-indigo-800 mb-4" />

              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < item.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-slate-200 dark:text-slate-600"
                    }`}
                  />
                ))}
              </div>

              <p className="text-slate-700 dark:text-slate-300 mb-6 leading-relaxed flex-1">
                "{item.comment}"
              </p>

              <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium mb-4">
                Re: {item.eventTitle}
              </p>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium shadow-md">
                  {getInitials(item.userName)}
                </div>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-100">{item.userName}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {new Date(item.date).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {testimonials.length === 0 && (
          <p className="text-center text-slate-400 dark:text-slate-500 text-sm mt-8">
            These are sample testimonials. Real reviews will appear here as users share their experiences.
          </p>
        )}
      </div>
    </section>
  );
}