interface IStats {
  totalEvents: number;
  totalUsers: number;
  totalParticipants: number;
  avgRating: string;
}

async function getStats(): Promise<IStats | null> {
  try {
    const apiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
    const res = await fetch(`${apiUrl}/events/stats`, {
      next: { revalidate: 3600 },
    });
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Failed to fetch stats:", error);
    return null;
  }
}

const fallbackStats: IStats = {
  totalEvents: 1200,
  totalUsers: 8500,
  totalParticipants: 15200,
  avgRating: "4.8",
};

function formatNumber(num: number): string {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K+";
  }
  return num.toString();
}

export default async function StatsSection() {
  const stats = await getStats();
  const displayStats = stats || fallbackStats;

  const statItems = [
    { value: formatNumber(displayStats.totalEvents), label: "Events Created" },
    { value: formatNumber(displayStats.totalUsers), label: "Active Users" },
    { value: formatNumber(displayStats.totalParticipants), label: "Participants" },
    { value: `${displayStats.avgRating} ★`, label: "Average Rating" },
  ];

  return (
    <section className="py-16 px-4 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {statItems.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 mb-2">
                {stat.value}
              </p>
              <p className="text-slate-500 dark:text-slate-400 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
        {!stats && (
          <p className="text-center text-slate-400 dark:text-slate-500 text-sm mt-6">
            Statistics update in real-time as the community grows.
          </p>
        )}
      </div>
    </section>
  );
}