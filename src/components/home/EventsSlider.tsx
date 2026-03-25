'use client';

import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { useCallback, useEffect, useState, useRef } from 'react';
import { IEvent } from '@/types';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, ChevronLeft, ChevronRight, User } from 'lucide-react';

export default function EventsSlider({ events }: { events: IEvent[] }) {
  const autoplayRef = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false, playOnInit: true })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'start' },
    [autoplayRef.current]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

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
          <Button variant="outline" className="mt-4">
            Browse All Events
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Embla wrapper */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div
          className="flex"
          style={{ touchAction: 'pan-y' }}
        >
          {events.map((event) => (
            <div
              key={event.id}
              style={{ flex: '0 0 100%' }}
              className="min-w-0 sm:[flex:0_0_50%] lg:[flex:0_0_33.333%] pl-4"
            >
              <div className="bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col h-full">
                {/* Top gradient */}
                <div
                  className="p-6"
                  style={{
                    background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
                  }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="bg-white/20 text-white text-xs font-medium px-2 py-1 rounded-full">
                      {event.eventType}
                    </span>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        event.isPaid
                          ? 'bg-orange-500 text-white'
                          : 'bg-green-500 text-white'
                      }`}
                    >
                      {event.isPaid ? `৳${event.fee}` : 'Free'}
                    </span>
                  </div>
                  <h3 className="text-white font-bold text-lg line-clamp-2 mt-2">
                    {event.title}
                  </h3>
                </div>

                {/* Body */}
                <div className="p-5 flex flex-col flex-1 gap-3">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <User className="w-3 h-3 text-blue-600" />
                    </div>
                    <span className="font-medium truncate">
                      {event.organizer?.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Calendar className="w-4 h-4 text-blue-500 flex-shrink-0" />
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
                    <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    <span className="line-clamp-1">{event.venue}</span>
                  </div>

                  <div className="flex-1" />

                  <Link href={`/events/${event.id}`}>
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

      {/* Prev */}
      <button
        onClick={scrollPrev}
        className="absolute -left-5 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-50 border border-slate-200 z-10 transition-colors"
      >
        <ChevronLeft className="w-5 h-5 text-slate-700" />
      </button>

      {/* Next */}
      <button
        onClick={scrollNext}
        className="absolute -right-5 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-50 border border-slate-200 z-10 transition-colors"
      >
        <ChevronRight className="w-5 h-5 text-slate-700" />
      </button>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-6">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === selectedIndex
                ? 'bg-blue-600 w-6'
                : 'bg-slate-300 w-2'
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