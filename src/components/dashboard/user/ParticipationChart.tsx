'use client';

import { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import axiosInstance from '@/lib/axios';

interface ChartData {
  month: string;
  count: number;
}

function buildMonthlyChart(participations: any[]): ChartData[] {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const currentMonth = new Date().getMonth();
  const last6Months = [];

  // get last 6 months
  for (let i = 5; i >= 0; i--) {
    const monthIndex = (currentMonth - i + 12) % 12;
    last6Months.push({
      month: months[monthIndex],
      monthIndex,
      year: new Date().getFullYear() - (currentMonth - monthIndex < 0 ? 1 : 0),
    });
  }

  // count participations per month
  return last6Months.map(({ month, monthIndex, year }) => {
    const count = participations.filter((p: any) => {
      const date = new Date(p.createdAt);
      return date.getMonth() === monthIndex && date.getFullYear() === year;
    }).length;

    return { month, count };
  });
}

export default function ParticipationChart() {
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const res = await axiosInstance.get('/participations/my');
        const participations = res.data.data || [];
        const chartData = buildMonthlyChart(participations);
        setData(chartData);
      } catch (error) {
        console.error('Failed to fetch chart data:', error);
        // fallback static data
        setData([
          { month: 'Nov', count: 0 },
          { month: 'Dec', count: 0 },
          { month: 'Jan', count: 1 },
          { month: 'Feb', count: 2 },
          { month: 'Mar', count: 3 },
          { month: 'Apr', count: 1 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, []);

  if (loading) {
    return (
      <div className="h-64 rounded-2xl bg-white/5 animate-pulse flex items-center justify-center">
        <p className="text-white/30">Loading chart...</p>
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.1)"
          />
          <XAxis
            dataKey="month"
            stroke="rgba(255,255,255,0.5)"
            tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
          />
          <YAxis
            stroke="rgba(255,255,255,0.5)"
            tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              background: 'rgba(20,20,30,0.9)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              color: '#fff',
              backdropFilter: 'blur(10px)',
            }}
            formatter={(value) => [`${value} events`, 'Participations']}
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#8b5cf6"
            strokeWidth={2}
            fill="url(#colorCount)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}