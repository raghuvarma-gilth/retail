'use client';
import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { AlertCircle, ArrowDown, ArrowUp, BarChart3, CloudRain, Grid, AlertTriangle, Loader2 } from 'lucide-react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { getAnomalyDetection, getWeatherAnalysis } from '@/lib/api';

const categoryData = [
  { name: 'Dairy', revenue: 450000 },
  { name: 'Beverages', revenue: 380000 },
  { name: 'Snacks', revenue: 320000 },
  { name: 'Staples', revenue: 290000 },
  { name: 'Personal Care', revenue: 210000 },
  { name: 'Cleaning', revenue: 180000 },
  { name: 'Produce', revenue: 150000 },
  { name: 'Frozen', revenue: 120000 },
];

const fallbackAnomalies = [
  { id: 1, date: '2026-08-20', product: 'Amul Butter 500g', actual: 145, expected: 45, deviation: '+222%', type: 'Spike', reason: 'Festival Promotion' },
  { id: 2, date: '2026-08-19', product: 'Aashirvaad Atta 5kg', actual: 12, expected: 65, deviation: '-81%', type: 'Drop', reason: 'Competitor Discount / Supply Issue' },
  { id: 3, date: '2026-08-18', product: 'Maggi Noodles 4-Pack', actual: 320, expected: 150, deviation: '+113%', type: 'Spike', reason: 'Heavy Rainfall' },
];

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState('abc');
  const [loading, setLoading] = useState(false);
  const [anomalies, setAnomalies] = useState<any[]>(fallbackAnomalies);
  const [weatherData, setWeatherData] = useState<any>(null);

  useEffect(() => {
    if (activeTab === 'anomaly') {
      setLoading(true);
      getAnomalyDetection()
        .then(res => setAnomalies(res.anomalies || fallbackAnomalies))
        .catch(() => setAnomalies(fallbackAnomalies))
        .finally(() => setLoading(false));
    } else if (activeTab === 'weather') {
      setLoading(true);
      getWeatherAnalysis()
        .then(res => setWeatherData(res))
        .catch(() => setWeatherData(null))
        .finally(() => setLoading(false));
    }
  }, [activeTab]);

  return (
    <ProtectedRoute allowedRoles={['owner']}>
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        </div>

        {/* Tabs */}
        <div className="flex bg-card p-1 rounded-lg w-full sm:w-fit overflow-x-auto gap-1">
          {[
            { id: 'abc', icon: <Grid size={16} />, label: 'ABC-XYZ Analysis' },
            { id: 'category', icon: <BarChart3 size={16} />, label: 'Category Performance' },
            { id: 'anomaly', icon: <AlertTriangle size={16} />, label: 'Anomaly Detection' },
            { id: 'weather', icon: <CloudRain size={16} />, label: 'Weather Impact' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id ? 'bg-muted text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Loading State for APIs */}
        {loading && (
          <div className="card-elevated p-12 flex flex-col items-center justify-center">
            <Loader2 size={32} className="animate-spin text-primary mb-4" />
            <p className="text-muted-foreground font-medium">Fetching real-time analytics...</p>
          </div>
        )}

        {/* Tab Contents */}
        {!loading && activeTab === 'abc' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card-elevated p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">What is ABC-XYZ Analysis?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                This powerful framework classifies your inventory across two dimensions to optimize purchasing and stock control.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-success/20 text-success flex items-center justify-center font-bold text-sm shrink-0">ABC</div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Revenue Contribution</p>
                    <p className="text-xs text-muted-foreground">Class A (Top 80% revenue), Class B (Next 15%), Class C (Bottom 5%)</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-info/20 text-info flex items-center justify-center font-bold text-sm shrink-0">XYZ</div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Demand Volatility</p>
                    <p className="text-xs text-muted-foreground">Class X (Steady/Predictable), Class Y (Variable), Class Z (Highly erratic)</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-elevated p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Your Inventory Matrix</h3>
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div></div><div className="font-bold text-muted-foreground">X (Steady)</div><div className="font-bold text-muted-foreground">Y (Variable)</div><div className="font-bold text-muted-foreground">Z (Erratic)</div>
                <div className="flex items-center justify-end pr-2 font-bold text-muted-foreground">A (High Val)</div>
                <div className="bg-success/20 text-success border border-success/30 rounded p-2 flex flex-col justify-center"><span className="text-lg font-bold">42</span><span>SKUs</span></div>
                <div className="bg-success/10 text-success border border-success/20 rounded p-2 flex flex-col justify-center"><span className="text-lg font-bold">18</span><span>SKUs</span></div>
                <div className="bg-warning/20 text-warning border border-warning/30 rounded p-2 flex flex-col justify-center"><span className="text-lg font-bold">5</span><span>SKUs</span></div>
                <div className="flex items-center justify-end pr-2 font-bold text-muted-foreground">B (Med Val)</div>
                <div className="bg-success/10 text-success border border-success/20 rounded p-2 flex flex-col justify-center"><span className="text-lg font-bold">86</span><span>SKUs</span></div>
                <div className="bg-muted text-foreground border border-border rounded p-2 flex flex-col justify-center"><span className="text-lg font-bold">124</span><span>SKUs</span></div>
                <div className="bg-warning/10 text-warning border border-warning/20 rounded p-2 flex flex-col justify-center"><span className="text-lg font-bold">32</span><span>SKUs</span></div>
                <div className="flex items-center justify-end pr-2 font-bold text-muted-foreground">C (Low Val)</div>
                <div className="bg-warning/20 text-warning border border-warning/30 rounded p-2 flex flex-col justify-center"><span className="text-lg font-bold">15</span><span>SKUs</span></div>
                <div className="bg-warning/10 text-warning border border-warning/20 rounded p-2 flex flex-col justify-center"><span className="text-lg font-bold">89</span><span>SKUs</span></div>
                <div className="bg-danger/10 text-danger border border-danger/20 rounded p-2 flex flex-col justify-center"><span className="text-lg font-bold">214</span><span>SKUs</span></div>
              </div>
            </div>
          </div>
        )}

        {!loading && activeTab === 'category' && (
          <div className="card-elevated p-6">
            <h3 className="text-lg font-bold text-foreground mb-6">Revenue by Category</h3>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="rgba(168,146,121,0.15)" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#8b7355'}} tickFormatter={(v) => `₹${v/1000}k`} />
                  <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#2d1f14', fontWeight: 500}} />
                  <RechartsTooltip 
                    cursor={{fill: 'rgba(139,105,20,0.05)'}}
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid rgba(139,105,20,0.1)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                    formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Revenue']}
                  />
                  <Bar dataKey="revenue" fill="#8b6914" radius={[0, 4, 4, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {!loading && activeTab === 'anomaly' && (
          <div className="card-elevated overflow-hidden">
            <div className="p-6 border-b border-border bg-gradient-to-r from-card to-danger/5">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <AlertCircle className="text-danger" size={20} />
                Recent Sales Anomalies
              </h3>
              <p className="text-sm text-muted-foreground mt-1">AI-detected abnormal sales patterns requiring investigation.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-muted text-muted-foreground">
                  <tr>
                    <th className="px-6 py-4 font-bold tracking-wider">Date</th>
                    <th className="px-6 py-4 font-bold tracking-wider">Product</th>
                    <th className="px-6 py-4 font-bold tracking-wider">Deviation</th>
                    <th className="px-6 py-4 font-bold tracking-wider">Pattern</th>
                    <th className="px-6 py-4 font-bold tracking-wider">Probable Cause</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {anomalies.map((anomaly) => (
                    <tr key={anomaly.id || anomaly.product} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 text-muted-foreground">{anomaly.date || new Date().toISOString().split('T')[0]}</td>
                      <td className="px-6 py-4 font-semibold text-foreground">{anomaly.product || anomaly.product_name}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 font-bold ${
                          (anomaly.deviation || '').includes('-') ? 'text-danger' : 'text-success'
                        }`}>
                          {(anomaly.deviation || '').includes('-') ? <ArrowDown size={14} /> : <ArrowUp size={14} />}
                          {Math.abs(parseInt(anomaly.deviation || '0'))}%
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          (anomaly.type || '').toLowerCase() === 'drop' ? 'bg-danger/10 text-danger' : 'bg-success/10 text-success'
                        }`}>
                          {anomaly.type || ((anomaly.deviation || '').includes('-') ? 'DROP' : 'SPIKE')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{anomaly.reason || anomaly.probable_cause || 'Investigate context'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!loading && activeTab === 'weather' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="card-elevated p-6 bg-gradient-to-br from-card to-info/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-info/10 text-info text-[10px] font-bold px-2 py-1 rounded-bl-lg">SOURCE: Weather API</div>
              <h3 className="text-lg font-bold text-foreground mb-4 mt-2">Current Outlook</h3>
              {weatherData ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-4xl font-bold text-foreground">{weatherData.temperature || 32}°C</span>
                    <CloudRain size={40} className="text-info opacity-80" />
                  </div>
                  <p className="text-sm font-medium text-foreground">{weatherData.condition || 'Heavy Rainfall Expected'}</p>
                  <div className="pt-4 border-t border-info/20">
                    <p className="text-xs text-info font-bold uppercase tracking-wider mb-2">Weather-Driven Impact</p>
                    <ul className="space-y-2 text-sm text-foreground">
                      {weatherData.impact_alerts?.map((alert: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <AlertCircle size={14} className="text-info shrink-0 mt-0.5" />
                          <span>{alert}</span>
                        </li>
                      ))}
                      {!weatherData.impact_alerts && (
                        <>
                          <li className="flex items-start gap-2"><ArrowUp size={14} className="text-success" /> +45% surge in Instant Foods</li>
                          <li className="flex items-start gap-2"><ArrowUp size={14} className="text-success" /> +30% surge in Beverages (Tea/Coffee)</li>
                          <li className="flex items-start gap-2"><ArrowDown size={14} className="text-danger" /> -20% drop in Cold Beverages</li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Weather service is currently unavailable or using fallback.</p>
              )}
            </div>
            
            <div className="lg:col-span-2 card-elevated p-6">
              <h3 className="text-lg font-bold text-foreground mb-6">Historical Weather Correlation</h3>
              <div className="h-[250px] flex items-center justify-center bg-muted rounded-xl border border-border">
                <p className="text-muted-foreground text-sm font-medium">Weather correlation charts visualization.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
    </ProtectedRoute>
  );
}
