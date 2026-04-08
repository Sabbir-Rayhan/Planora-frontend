import { CalendarPlus, UsersRound, CalendarCheck } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: CalendarPlus,
    title: "Create an Event",
    description: "Set up your event details, choose public or private, and set the fee.",
  },
  {
    step: "02",
    icon: UsersRound,
    title: "Invite Participants",
    description: "Share your event link or invite specific people to join.",
  },
  {
    step: "03",
    icon: CalendarCheck,
    title: "Manage & Enjoy",
    description: "Approve participants, track attendance, and have a great time!",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">
            Simple Process
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mt-2">
            How It Works
          </h2>
          <p className="text-slate-500 mt-3 max-w-xl mx-auto">
            Get started in three easy steps and host your first event today.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((item) => (
            <div key={item.step} className="text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  {item.step}
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <h3 className="font-bold text-xl text-slate-800 mb-2">
                {item.title}
              </h3>
              <p className="text-slate-500">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}