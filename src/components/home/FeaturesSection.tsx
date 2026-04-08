import { CalendarCheck, Users, Lock, Sparkles } from "lucide-react";

const features = [
  {
    icon: CalendarCheck,
    title: "Easy Event Creation",
    description: "Create and manage events in minutes with our intuitive tools.",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: Users,
    title: "Community Building",
    description: "Connect with like-minded people and grow your network.",
    color: "bg-purple-100 text-purple-600",
  },
  {
    icon: Lock,
    title: "Privacy Controls",
    description: "Choose between public and private events with full control.",
    color: "bg-green-100 text-green-600",
  },
  {
    icon: Sparkles,
    title: "Smart Recommendations",
    description: "Get personalized event suggestions based on your interests.",
    color: "bg-orange-100 text-orange-600",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-16 px-4 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800">
            Why Choose Planora?
          </h2>
          <p className="text-slate-500 mt-3 max-w-xl mx-auto">
            Everything you need to create, manage, and discover amazing events.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-slate-100"
            >
              <div
                className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4`}
              >
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-slate-500 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}