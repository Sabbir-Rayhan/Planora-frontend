import Link from 'next/link';
import { Calendar, Clock, ArrowRight, Tag } from 'lucide-react';

const blogs = [
  {
    id: 1,
    title: 'How to Plan a Successful Tech Meetup in Dhaka',
    excerpt:
      'Planning a tech meetup can be overwhelming. Here are proven strategies to ensure your event is well-attended, organized, and memorable for all participants.',
    category: 'Event Planning',
    date: '2026-03-15',
    readTime: '5 min read',
    gradient: 'from-blue-500 to-cyan-500',
    emoji: '💻',
  },
  {
    id: 2,
    title: 'The Complete Guide to Event Ticketing and Payments',
    excerpt:
      'Managing ticket sales and payments for events can be complex. Learn how to set up a smooth payment flow that ensures both organizers and attendees have a great experience.',
    category: 'Payments',
    date: '2026-03-10',
    readTime: '7 min read',
    gradient: 'from-purple-500 to-pink-500',
    emoji: '💳',
  },
  {
    id: 3,
    title: '10 Tips for Managing Large Event Participant Lists',
    excerpt:
      'When your event grows, managing hundreds of participants becomes a challenge. These 10 tips will help you stay organized and ensure everyone has a seamless experience.',
    category: 'Management',
    date: '2026-03-05',
    readTime: '6 min read',
    gradient: 'from-orange-500 to-red-500',
    emoji: '👥',
  },
  {
    id: 4,
    title: 'Private vs Public Events: Which Should You Choose?',
    excerpt:
      'Deciding between a public and private event format is crucial. This guide breaks down the pros and cons of each type to help you make the right decision for your audience.',
    category: 'Strategy',
    date: '2026-02-28',
    readTime: '4 min read',
    gradient: 'from-green-500 to-teal-500',
    emoji: '🔒',
  },
  {
    id: 5,
    title: 'Building Community Through Regular Events',
    excerpt:
      'Consistent, well-planned events are the backbone of any thriving community. Discover how to build lasting connections by hosting regular gatherings that people look forward to.',
    category: 'Community',
    date: '2026-02-20',
    readTime: '8 min read',
    gradient: 'from-indigo-500 to-purple-500',
    emoji: '🤝',
  },
  {
    id: 6,
    title: 'How SSLCommerz Makes Event Payments Easy in Bangladesh',
    excerpt:
      'For Bangladeshi event organizers, SSLCommerz offers a reliable and trusted payment gateway. Learn how to integrate it into your event management workflow seamlessly.',
    category: 'Technology',
    date: '2026-02-15',
    readTime: '5 min read',
    gradient: 'from-yellow-500 to-orange-500',
    emoji: '🛡️',
  },
];

const categories = ['All', 'Event Planning', 'Payments', 'Management', 'Strategy', 'Community', 'Technology'];

export default function BlogPage() {
  return (
    <div className="min-h-screen">

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 text-white py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="text-indigo-400 font-semibold text-sm uppercase tracking-wider">
            Planora Blog
          </span>
          <h1 className="text-4xl font-bold mt-3 mb-4">
            Insights & Resources
          </h1>
          <p className="text-slate-300 text-lg">
            Tips, guides, and best practices for event organizers.
            Stay informed and make your next event a success.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 px-4 bg-white border-b sticky top-16 z-10">
        <div className="max-w-6xl mx-auto flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                cat === 'All'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">

          {/* Featured Post */}
          <div className="mb-10">
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-lg transition-shadow">
              <div className={`bg-gradient-to-br ${blogs[0].gradient} h-64 flex items-center justify-center`}>
                <span className="text-8xl">{blogs[0].emoji}</span>
              </div>
              <div className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-indigo-100 text-indigo-700 text-xs font-medium px-3 py-1 rounded-full">
                    Featured
                  </span>
                  <span className="bg-slate-100 text-slate-600 text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {blogs[0].category}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-3">
                  {blogs[0].title}
                </h2>
                <p className="text-slate-600 leading-relaxed mb-6">
                  {blogs[0].excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      {new Date(blogs[0].date).toLocaleDateString('en-US', {
                        month: 'long', day: 'numeric', year: 'numeric'
                      })}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      {blogs[0].readTime}
                    </span>
                  </div>
                  <button className="flex items-center gap-2 text-indigo-600 font-semibold hover:gap-3 transition-all">
                    Read More <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.slice(1).map((blog) => (
              <div
                key={blog.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex flex-col"
              >
                <div className={`bg-gradient-to-br ${blog.gradient} h-44 flex items-center justify-center`}>
                  <span className="text-6xl">{blog.emoji}</span>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-slate-100 text-slate-600 text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {blog.category}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-800 mb-2 line-clamp-2 flex-1">
                    {blog.title}
                  </h3>
                  <p className="text-slate-500 text-sm line-clamp-3 mb-4">
                    {blog.excerpt}
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(blog.date).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric'
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {blog.readTime}
                      </span>
                    </div>
                    <button className="text-indigo-600 text-sm font-medium hover:text-indigo-700 flex items-center gap-1">
                      Read <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 px-4 bg-gradient-to-br from-indigo-600 to-purple-700 text-white text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl font-bold mb-3">Stay Updated</h2>
          <p className="text-indigo-100 mb-8">
            Get the latest event planning tips delivered to your inbox every week.
          </p>
          <div className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-xl text-slate-800 text-sm focus:outline-none"
            />
            <button className="px-6 py-3 bg-white text-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 transition-colors whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}