// components/dashboard/admin/AdminUsers.tsx
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
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
    <Card className="shadow-sm border-0 overflow-hidden">
      <CardHeader className="border-b bg-white/50">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          Manage Users
          <span className="text-sm font-normal text-muted-foreground">
            ({users.length} total)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="p-4 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-12 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.status === 'ACTIVE' ? 'outline' : 'destructive'}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      {user.role !== 'ADMIN' && (
                        <Button
                          size="sm"
                          variant={user.status === 'ACTIVE' ? 'destructive' : 'outline'}
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
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}