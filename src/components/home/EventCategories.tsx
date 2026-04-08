import Link from 'next/link';

const categories = [
  {
    label: 'Public Free',
    description: 'Open to everyone, no cost',
    href: '/events?eventType=PUBLIC&isPaid=false',
    bg: 'bg-green-50 dark:bg-green-950/30',
    border: 'border-green-200 dark:border-green-800',
    text: 'text-green-700 dark:text-green-400',
    emoji: '🌍',
  },
  {
    label: 'Public Paid',
    description: 'Open to all with registration fee',
    href: '/events?eventType=PUBLIC&isPaid=true',
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    border: 'border-blue-200 dark:border-blue-800',
    text: 'text-blue-700 dark:text-blue-400',
    emoji: '🎟️',
  },
  {
    label: 'Private Free',
    description: 'Invite only, no cost',
    href: '/events?eventType=PRIVATE&isPaid=false',
    bg: 'bg-purple-50 dark:bg-purple-950/30',
    border: 'border-purple-200 dark:border-purple-800',
    text: 'text-purple-700 dark:text-purple-400',
    emoji: '🔒',
  },
  {
    label: 'Private Paid',
    description: 'Exclusive events with fee',
    href: '/events?eventType=PRIVATE&isPaid=true',
    bg: 'bg-orange-50 dark:bg-orange-950/30',
    border: 'border-orange-200 dark:border-orange-800',
    text: 'text-orange-700 dark:text-orange-400',
    emoji: '👑',
  },
];

export default function EventCategories() {
  return (
    <section className="py-16 px-4 bg-slate-50 dark:bg-slate-900/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Event Categories</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Find the right type of event for you
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link key={cat.label} href={cat.href}>
              <div
                className={`${cat.bg} ${cat.border} border-2 rounded-xl p-6 text-center hover:shadow-md dark:hover:shadow-slate-800 transition-shadow cursor-pointer`}
              >
                <div className="text-4xl mb-3">{cat.emoji}</div>
                <h3 className={`font-bold text-lg ${cat.text}`}>{cat.label}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{cat.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}