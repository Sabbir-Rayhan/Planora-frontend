import { Users, Target, Heart, Award, Calendar, Globe } from 'lucide-react';
import Link from 'next/link';

const team = [
  {
    name: 'Sabbir Rayhan',
    role: 'Full Stack Developer',
    bio: 'Building seamless event experiences with modern web technologies.',
    initials: 'SR',
    gradient: 'from-blue-500 to-purple-600',
  },
];

const values = [
  {
    icon: Target,
    title: 'Our Mission',
    desc: 'To make event planning accessible, efficient, and enjoyable for everyone — from small gatherings to large conferences.',
  },
  {
    icon: Heart,
    title: 'Our Vision',
    desc: 'A world where every event creates meaningful connections and unforgettable memories for all participants.',
  },
  {
    icon: Globe,
    title: 'Our Reach',
    desc: 'Serving event organizers and participants across Bangladesh and beyond with a platform built for the modern age.',
  },
];

const stats = [
  { value: '500+', label: 'Events Created' },
  { value: '2K+', label: 'Active Users' },
  { value: '50+', label: 'Cities Reached' },
  { value: '4.8★', label: 'Average Rating' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-indigo-400 font-semibold text-sm uppercase tracking-wider">
            About Planora
          </span>
          <h1 className="text-5xl font-bold mt-4 mb-6">
            We Make Events{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              Extraordinary
            </span>
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">
            Planora is a modern event management platform designed to simplify
            how people create, discover, and participate in events. From tech
            meetups to cultural festivals — we power them all.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 bg-white border-b">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                {stat.value}
              </p>
              <p className="text-slate-500 mt-1 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wider">
              What Drives Us
            </span>
            <h2 className="text-3xl font-bold text-slate-800 mt-3">
              Our Core Values
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-5">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wider">
                Our Story
              </span>
              <h2 className="text-3xl font-bold text-slate-800 mt-3 mb-6">
                Built for Event Enthusiasts
              </h2>
              <div className="space-y-4 text-slate-600 leading-relaxed">
                <p>
                  Planora was born from the frustration of managing events
                  through scattered spreadsheets, endless email threads, and
                  manual payment tracking. We knew there had to be a better way.
                </p>
                <p>
                  Built with Next.js, Node.js, and PostgreSQL, Planora brings
                  together everything you need — event creation, participant
                  management, payment processing, and real-time updates — in one
                  beautiful platform.
                </p>
                <p>
                  Whether you're organizing a small birthday party or a large
                  corporate conference, Planora scales with your needs and keeps
                  everything organized.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-8">
              <div className="space-y-4">
                {[
                  { icon: Calendar, text: 'Create & manage events easily' },
                  { icon: Users, text: 'Handle participants & approvals' },
                  { icon: Award, text: 'Secure payment integration' },
                  { icon: Heart, text: 'Build meaningful connections' },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.text} className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <p className="text-slate-700 font-medium">{item.text}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wider">
            The Team
          </span>
          <h2 className="text-3xl font-bold text-slate-800 mt-3 mb-12">
            Built with Passion
          </h2>
          <div className="flex justify-center">
            {team.map((member) => (
              <div
                key={member.name}
                className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 max-w-sm"
              >
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${member.gradient} flex items-center justify-center text-white text-2xl font-bold mx-auto mb-5`}>
                  {member.initials}
                </div>
                <h3 className="text-xl font-bold text-slate-800">{member.name}</h3>
                <p className="text-indigo-600 font-medium text-sm mt-1 mb-3">
                  {member.role}
                </p>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-indigo-600 to-purple-700 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-indigo-100 mb-8">
            Join thousands of event organizers who trust Planora to power their events.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-3 bg-white text-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 transition-colors"
            >
              Create Account
            </Link>
            <Link
              href="/events"
              className="px-8 py-3 border-2 border-white/30 text-white rounded-xl font-semibold hover:bg-white/10 transition-colors"
            >
              Browse Events
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}