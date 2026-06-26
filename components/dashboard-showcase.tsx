'use client';

import * as React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  Legend,
} from 'recharts';
import { TrendingUp, Users, ShieldAlert, Cpu } from 'lucide-react';

const trendData = [
  { month: 'Jan', sales: 4000, conversion: 240 },
  { month: 'Feb', sales: 3000, conversion: 139 },
  { month: 'Mar', sales: 2000, conversion: 980 },
  { month: 'Apr', sales: 2780, conversion: 390 },
  { month: 'May', sales: 1890, conversion: 480 },
  { month: 'Jun', sales: 2390, conversion: 380 },
  { month: 'Jul', sales: 3490, conversion: 430 },
  { month: 'Aug', sales: 4200, conversion: 520 },
  { month: 'Sep', sales: 5100, conversion: 610 },
  { month: 'Oct', sales: 6800, conversion: 780 },
  { month: 'Nov', sales: 7200, conversion: 890 },
  { month: 'Dec', sales: 9500, conversion: 1100 },
];

const regionalData = [
  { name: 'North America', volume: 450, growth: 12 },
  { name: 'Europe', volume: 320, growth: 8 },
  { name: 'Asia Pacific', volume: 510, growth: 22 },
  { name: 'Latin America', volume: 180, growth: 5 },
  { name: 'Africa', volume: 120, growth: 15 },
];

const channelData = [
  { name: 'Direct', value: 400 },
  { name: 'Organic Search', value: 300 },
  { name: 'Referral', value: 200 },
  { name: 'Paid Ads', value: 100 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export function DashboardShowcase() {
  const [activeMetric, setActiveMetric] = React.useState<'sales' | 'conversion'>('sales');

  return (
    <section id="dashboard-showcase" className="py-20 bg-secondary/10 border-y border-border/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Interactive Dashboard Showcase
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            Explore Mariam's live dashboard simulation highlighting sales conversion trends, channel distribution models, and regional growth metrics.
          </p>
        </div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-5 rounded-2xl bg-card border border-border/50 hover:shadow-md transition-all flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-muted-foreground uppercase">Revenue Tracked</span>
              <TrendingUp className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold">$12.4M</h3>
              <p className="text-[10px] text-emerald-500 font-medium mt-1">+14.2% from last quarter</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-card border border-border/50 hover:shadow-md transition-all flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-muted-foreground uppercase">Unique Cohorts</span>
              <Users className="w-5 h-5 text-blue-500" />
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold">542,000</h3>
              <p className="text-[10px] text-blue-500 font-medium mt-1">+8.5% user conversion</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-card border border-border/50 hover:shadow-md transition-all flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-muted-foreground uppercase">Pipeline SLA</span>
              <ShieldAlert className="w-5 h-5 text-indigo-500" />
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold">99.98%</h3>
              <p className="text-[10px] text-indigo-500 font-medium mt-1">Uptime maintained</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-card border border-border/50 hover:shadow-md transition-all flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-muted-foreground uppercase">ML Classifiers</span>
              <Cpu className="w-5 h-5 text-amber-500" />
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold">14 Deployed</h3>
              <p className="text-[10px] text-amber-500 font-medium mt-1">Mean precision: 89.2%</p>
            </div>
          </div>
        </div>

        {/* Dashboard Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Trend Chart */}
          <div className="lg:col-span-2 p-6 rounded-2xl bg-card border border-border/50 glass-card">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h4 className="text-sm font-semibold">Performance Trends</h4>
                <p className="text-xs text-muted-foreground">Volume growth tracked throughout 2026</p>
              </div>
              <div className="flex space-x-1.5 p-1 bg-secondary rounded-lg text-xs">
                <button
                  onClick={() => setActiveMetric('sales')}
                  className={`px-2.5 py-1.5 rounded-md font-medium transition-all ${
                    activeMetric === 'sales' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
                  }`}
                >
                  Sales Vol
                </button>
                <button
                  onClick={() => setActiveMetric('conversion')}
                  className={`px-2.5 py-1.5 rounded-md font-medium transition-all ${
                    activeMetric === 'conversion' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'
                  }`}
                >
                  Conversions
                </button>
              </div>
            </div>

            <div className="h-72 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="month" tickLine={false} />
                  <YAxis tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      color: '#0f172a',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey={activeMetric === 'sales' ? 'sales' : 'conversion'}
                    stroke="#3b82f6"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorMetric)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Channels & Regional breakdown */}
          <div className="space-y-6">
            {/* Channel Pie Chart */}
            <div className="p-6 rounded-2xl bg-card border border-border/50 glass-card">
              <h4 className="text-sm font-semibold mb-4">Traffic Acquisition</h4>
              <div className="h-44 w-full flex items-center justify-between">
                <div className="h-full w-1/2">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={channelData}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={65}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {channelData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-1/2 space-y-2 text-xs">
                  {channelData.map((d, index) => (
                    <div key={d.name} className="flex items-center space-x-2">
                      <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[index] }} />
                      <span className="text-muted-foreground truncate">{d.name} ({d.value})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Regional Performance */}
            <div className="p-6 rounded-2xl bg-card border border-border/50 glass-card">
              <h4 className="text-sm font-semibold mb-4">Regional Distribution</h4>
              <div className="h-44 w-full text-xs">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={regionalData} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={80} />
                    <Tooltip />
                    <Bar dataKey="volume" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={12} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
