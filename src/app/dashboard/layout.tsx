import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken');

  if (!token) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {children}
      </div>
    </div>
  );
}