"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { IEvent } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import toast from "react-hot-toast";
import Link from "next/link";
import CreateEventModal from "./CreateEventModal";

export default function MyEvents() {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchEvents = async () => {
    try {
      const res = await axiosInstance.get("/events/my/events");
      setEvents(res.data.data);
    } catch {
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (eventId: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
      await axiosInstance.delete(`/events/${eventId}`);
      toast.success("Event deleted");
      fetchEvents();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-slate-800">My Events</h2>
        <Button onClick={() => setShowModal(true)}>+ Create Event</Button>
      </div>

      {loading ? (
        <p className="text-slate-400">Loading...</p>
      ) : events.length === 0 ? (
        <p className="text-slate-400">You have not created any events yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event) => (
            <Card key={event.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-base line-clamp-1">
                    {event.title}
                  </CardTitle>
                  <Badge variant="outline">{event.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-3">
                  <Badge
                    variant={
                      event.eventType === "PUBLIC" ? "default" : "secondary"
                    }
                  >
                    {event.eventType}
                  </Badge>
                  <Badge variant={event.isPaid ? "destructive" : "outline"}>
                    {event.isPaid ? `৳${event.fee}` : "Free"}
                  </Badge>
                </div>
                <p className="text-sm text-slate-500 mb-1">
                  📅 {new Date(event.date).toLocaleDateString()}
                </p>
                <p className="text-sm text-slate-500 mb-3">
                  👥 {event._count?.participations || 0} participants
                </p>


                    {/* fix */}
                <div className="flex gap-2">
                  <Link href={`/events/${event.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      View
                    </Button>
                  </Link>
                  <Link
                    href={`/dashboard/user/events/${event.id}/participants`}
                  >
                    <Button size="sm" variant="secondary">
                      👥
                    </Button>
                  </Link>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(event.id)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {showModal && (
        <CreateEventModal
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            fetchEvents();
          }}
        />
      )}
    </div>
  );
}
