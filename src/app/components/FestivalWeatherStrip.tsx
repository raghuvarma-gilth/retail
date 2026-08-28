'use client';
import React, { useState, useEffect } from 'react';
import { Calendar, Cloud, Thermometer, Droplets, TrendingUp, Sparkles } from 'lucide-react';
import { getUpcomingFestivals } from '@/lib/api';

interface FestivalItem {
  id: string;
  name: string;
  daysAway: number;
  impact: string;
  color: string;
}

const defaultFestivals: FestivalItem[] = [
  { id: 'fest-ganesh', name: 'Ganesh Chaturthi', daysAway: 9, impact: '+34% sweets & snacks', color: 'text-orange-600 bg-orange-50 border-orange-200' },
  { id: 'fest-onam', name: 'Onam', daysAway: 16, impact: '+22% rice & lentils', color: 'text-green-700 bg-green-50 border-green-200' },
];

const weatherInsights = [
  { id: 'wi-rain', text: 'Heavy rain forecast tomorrow → +18% instant noodles, +12% bread', icon: <Cloud size={13} /> },
  { id: 'wi-temp', text: '32°C today → cold beverages demand up 24% vs baseline', icon: <Thermometer size={13} /> },
];

export default function FestivalWeatherStrip() {
  const [festivals, setFestivals] = useState<FestivalItem[]>(defaultFestivals);
  const [isAiPowered, setIsAiPowered] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadFestivals() {
      try {
        const res = await getUpcomingFestivals();
        if (isMounted && res && res.festivals && res.festivals.length > 0) {
          setFestivals(res.festivals);
          setIsAiPowered(true);
        }
      } catch {
        // Keeps high quality defaults on network latency
      }
    }
    loadFestivals();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
      {/* Festival countdown */}
      <div className="card-elevated p-3">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-accent" />
            <span className="text-xs font-semibold text-foreground uppercase tracking-wide">Upcoming Festival Demand</span>
          </div>
          {isAiPowered && (
            <span className="flex items-center gap-1 text-[10px] text-primary font-medium bg-primary/10 px-1.5 py-0.5 rounded">
              <Sparkles size={10} />
              Gemini AI
            </span>
          )}
        </div>
        <div className="flex gap-3 flex-wrap">
          {festivals?.map((f) => (
            <div key={f?.id} className={`flex items-center gap-2 border rounded-md px-3 py-1.5 ${f?.color || 'text-orange-600 bg-orange-50 border-orange-200'}`}>
              <div>
                <p className="text-xs font-semibold">{f?.name}</p>
                <p className="text-[10px] font-medium">
                  <span className="font-bold">{f?.daysAway} days away</span> · {f?.impact}
                </p>
              </div>
              <TrendingUp size={13} />
            </div>
          ))}
        </div>
      </div>
      {/* Weather insights */}
      <div className="card-elevated p-3">
        <div className="flex items-center gap-2 mb-2">
          <Droplets size={14} className="text-info" />
          <span className="text-xs font-semibold text-foreground uppercase tracking-wide">Weather-Aware Demand Signals</span>
          <span className="ml-auto text-[10px] text-muted-foreground">Bangalore · 32°C · Partly Cloudy</span>
        </div>
        <div className="space-y-1.5">
          {weatherInsights?.map((w) => (
            <div key={w?.id} className="flex items-start gap-2 text-xs text-muted-foreground">
              <span className="text-info mt-0.5 shrink-0">{w?.icon}</span>
              <span>{w?.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}