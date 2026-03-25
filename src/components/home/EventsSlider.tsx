'use client';

import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { useCallback, useEffect, useState } from 'react';
import { IEvent } from '@/types';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, ChevronLeft, ChevronRight, User } from 'lucide-react';

export default function EventsSlider({ events }: { events: IEvent[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: 'start',
      slidesToScroll: 1,
      breakpoints: {
        '(min-width: 768px)': { slidesToScroll: 1 },
      },
    },
    [Autoplay({ delay: 3000, stopOnInteraction: false, playOnInit: true })]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    });
  }, [emblaApi]);

  if (events.length === 0) {
    return (
      <div className="text-center py-16 bg-slate-50 rounded-2xl">
        <p className="text-slate-400 text-lg">No upcoming events yet.</p>
        <Link href="/events">
          <Button variant="outline" className="mt-4">Browse All Events</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="relative px-8">
      {/* Embla Viewport */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {events.map((event) => (
            <div
              key={event.id}
              className="flex-none w-full md:w-1/2 lg:w-1/3 pl-4"
              style={{ minWidth: 0 }}
            >
              <div className="bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden h-full flex flex-col">
                {/* Card Top */}
                <div className="bg-linear-to-br from-blue-500 via-purple-500 to-pink-500 p-6">
                  <div className="flex justify-between items-start mb-3">
                    <Badge className="bg-white/20 text-white border-0 text-xs">
                      {event.eventType}
                    </Badge>
                    <Badge
                      className={`border-0 text-xs ${
                        event.isPaid
                          ? 'bg-orange-500 text-white'
                          : 'bg-green-500 text-white'
                      }`}
                    >
                      {event.isPaid ? `৳${event.fee}` : 'Free'}
                    </Badge>
                  </div>
                  <h3 className="text-white font-bold text-lg line-clamp-2">
                    {event.title}
                  </h3>
                </div>

                {/* Card Body */}
                <div className="p-5 flex flex-col flex-1 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                      <User className="w-3 h-3 text-blue-600" />
                    </div>
                    <span className="font-medium truncate">
                      {event.organizer?.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Calendar className="w-4 h-4 text-blue-500 shrink-0" />
                    <span>
                      {new Date(event.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <MapPin className="w-4 h-4 text-blue-500 shrink-0" />
                    <span className="line-clamp-1">{event.venue}</span>
                  </div>

                  <div className="flex-1" />

                  <Link href={`/events/${event.id}`} className="block">
                    <Button
                      className="w-full bg-slate-900 hover:bg-blue-600 transition-colors"
                      size="sm"
                    >
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Prev Button */}
      <button
        onClick={scrollPrev}
        className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-50 transition-colors border border-slate-200 z-10"
      >
        <ChevronLeft className="w-5 h-5 text-slate-700" />
      </button>

      {/* Next Button */}
      <button
        onClick={scrollNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-50 transition-colors border border-slate-200 z-10"
      >
        <ChevronRight className="w-5 h-5 text-slate-700" />
      </button>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-6">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === selectedIndex
                ? 'bg-blue-600 w-6'
                : 'bg-slate-300'
            }`}
          />
        ))}
      </div>

      {/* View All */}
      <div className="text-center mt-8">
        <Link href="/events">
          <Button
            size="lg"
            variant="outline"
            className="border-2 border-slate-800 text-slate-800 hover:bg-slate-800 hover:text-white px-10 transition-colors"
          >
            View All Events
          </Button>
        </Link>
      </div>
    </div>
  );
}