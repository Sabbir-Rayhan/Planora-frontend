'use client';

import { useState } from 'react';
import axiosInstance from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import toast from 'react-hot-toast';

export default function SendInvitation({ eventId }: { eventId: string }) {
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId.trim()) {
      toast.error('Please enter a user ID');
      return;
    }
    setLoading(true);
    try {
      await axiosInstance.post('/invitations', {
        eventId,
        userId,
      });
      toast.success('Invitation sent successfully!');
      setUserId('');
      setOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to send invitation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button
        size="sm"
        variant="secondary"
        onClick={() => setOpen(!open)}
      >
        ✉️ Invite
      </Button>

      {open && (
        <div className="mt-3 p-4 border rounded-lg bg-white shadow-sm">
          <h4 className="font-semibold text-slate-700 mb-3">
            Send Invitation
          </h4>
          <form onSubmit={handleSend} className="space-y-3">
            <div className="space-y-1">
              <Label className="text-xs">User ID</Label>
              <Input
                placeholder="Paste user ID here"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="text-sm"
              />
              <p className="text-xs text-slate-400">
                User ID can be found in Admin Dashboard → Users table
              </p>
            </div>
            <div className="flex gap-2">
              <Button type="submit" size="sm" disabled={loading}>
                {loading ? 'Sending...' : 'Send'}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}