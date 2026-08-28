import React from 'react';
import { Calendar, Cloud, Thermometer, Droplets, TrendingUp } from 'lucide-react';

const festivalData = [
  { id: 'fest-ganesh', name: 'Ganesh Chaturthi', daysAway: 8, impact: '+34% sweets & snacks', color: 'text-orange-600 bg-orange-50 border-orange-200' },
  { id: 'fest-onam', name: 'Onam', daysAway: 14, impact: '+22% rice & lentils', color: 'text-green-700 bg-green-50 border-green-200' },
];

const weatherInsights = [
  { id: 'wi-rain', text: 'Heavy rain forecast tomorrow → +18% instant noodles, +12% bread', icon: <Cloud size={13} /> },
  { id: 'wi-temp', text: '32°C today → cold beverages demand up 24% vs baseline', icon: <Thermometer size={13} /> },
];

export default function FestivalWeatherStrip() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
      {/* Festival countdown */}
      <div className="card-elevated p-3">
        <div className="flex items-center gap-2 mb-2">
          <Calendar size={14} className="text-accent" />
          <span className="text-xs font-semibold text-foreground uppercase tracking-wide">Upcoming Festival Demand</span>
        </div>
        <div className="flex gap-3 flex-wrap">
          {festivalData?.map((f) => (
            <div key={f?.id} className={`flex items-center gap-2 border rounded-md px-3 py-1.5 ${f?.color}`}>
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