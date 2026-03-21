'use client';

import { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axios';
import { IUser } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get('/users');
      setUsers(res.data.data);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleStatusChange = async (
    userId: string,
    status: 'ACTIVE' | 'BLOCKED'
  ) => {
    try {
      await axiosInstance.patch(`/users/${userId}/status`, { status });
      toast.success(`User ${status === 'BLOCKED' ? 'blocked' : 'activated'}`);
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-800 mb-4">
        Manage Users
        <span className="ml-2 text-sm font-normal text-slate-500">
          ({users.length} total)
        </span>
      </h2>

      {loading ? (
        <p className="text-slate-400">Loading...</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="text-left px-4 py-3">Name</th>
                <th className="text-left px-4 py-3">Email</th>
                <th className="text-left px-4 py-3">Role</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Joined</th>
                <th className="text-left px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium">{user.name}</td>
                  <td className="px-4 py-3 text-slate-500">{user.email}</td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={
                        user.role === 'ADMIN' ? 'default' : 'secondary'
                      }
                    >
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={
                        user.status === 'ACTIVE' ? 'outline' : 'destructive'
                      }
                    >
                      {user.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    {user.role !== 'ADMIN' && (
                      <Button
                        size="sm"
                        variant={
                          user.status === 'ACTIVE' ? 'destructive' : 'outline'
                        }
                        onClick={() =>
                          handleStatusChange(
                            user.id,
                            user.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE'
                          )
                        }
                      >
                        {user.status === 'ACTIVE' ? 'Block' : 'Activate'}
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}