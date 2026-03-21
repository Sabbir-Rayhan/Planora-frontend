import AdminEvents from "@/components/dashboard/admin/AdminEvents";
import AdminPayments from "@/components/dashboard/admin/AdminPayments";
import AdminUsers from "@/components/dashboard/admin/AdminUsers";


export default function AdminDashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">
        Admin Dashboard
      </h1>
      <div className="space-y-10">
        <AdminUsers />
        <AdminEvents />
        <AdminPayments />
      </div>
    </div>
  );
}