import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  FileText,
  FlaskConical,
  FolderOpen,
  Inbox,
} from 'lucide-react';
import api from '../../lib/api';
import type { ApiResponse, DashboardStats, Paginated } from '../../lib/types';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { Badge } from '../components/Badge';
import { TableSkeleton } from '../components/Skeleton';
import { EmptyState } from '../components/EmptyState';

interface QuoteRow {
  _id: string;
  email: string;
  service: string;
  quantity: string;
  status: string;
  createdAt: string;
}

interface MessageRow {
  _id: string;
  name: string;
  email: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface RecentRequest {
  id: string;
  type: 'Quote' | 'Message';
  who: string;
  detail: string;
  status: string;
  createdAt: string;
}

const STAT_CARDS = [
  { key: 'newQuotes', label: 'New Quotes', icon: FileText, tint: 'bg-amber-50 text-amber-600' },
  { key: 'newFreeTests', label: 'New Free Tests', icon: FlaskConical, tint: 'bg-blue-50 text-blue-600' },
  { key: 'unreadMessages', label: 'Unread Messages', icon: Inbox, tint: 'bg-rose-50 text-rose-600' },
  { key: 'totalWorks', label: 'Total Works', icon: FolderOpen, tint: 'bg-emerald-50 text-emerald-600' },
] as const;

function formatDate(value: string) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) +
    ' · ' +
    date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

/** Admin home: KPI cards, 7-day requests bar chart and a recent-requests table. */
export const Dashboard: React.FC = () => {
  const statsQuery = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: async () => {
      const res = await api.get<ApiResponse<DashboardStats>>('/admin/stats');
      return res.data.data;
    },
  });

  const quotesQuery = useQuery({
    queryKey: ['admin', 'quotes', 'recent'],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Paginated<QuoteRow>>>('/admin/quotes', {
        params: { page: 1, limit: 6 },
      });
      return res.data.data.items;
    },
  });

  const messagesQuery = useQuery({
    queryKey: ['admin', 'messages', 'recent'],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Paginated<MessageRow>>>('/admin/messages', {
        params: { page: 1, limit: 6 },
      });
      return res.data.data.items;
    },
  });

  const stats = statsQuery.data;

  const recentRequests: RecentRequest[] = React.useMemo(() => {
    const quotes: RecentRequest[] = (quotesQuery.data || []).map((q) => ({
      id: `q-${q._id}`,
      type: 'Quote' as const,
      who: q.email,
      detail: [q.service, q.quantity && `Qty ${q.quantity}`].filter(Boolean).join(' · ') || '—',
      status: q.status,
      createdAt: q.createdAt,
    }));
    const messages: RecentRequest[] = (messagesQuery.data || []).map((m) => ({
      id: `m-${m._id}`,
      type: 'Message' as const,
      who: m.name || m.email,
      detail: m.message,
      status: m.isRead ? 'read' : 'unread',
      createdAt: m.createdAt,
    }));
    return [...quotes, ...messages]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 8);
  }, [quotesQuery.data, messagesQuery.data]);

  const chartData = React.useMemo(() => {
    const byDate = new Map<string, number>();
    for (const point of stats?.requestsPerDay || []) {
      byDate.set(point.date, point.count);
    }
    // Always show the last 7 calendar days, even when a day had zero requests.
    const days: { date: string; label: string; count: number }[] = [];
    for (let i = 6; i >= 0; i -= 1) {
      const day = new Date();
      day.setHours(0, 0, 0, 0);
      day.setDate(day.getDate() - i);
      const key = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;
      days.push({
        date: key,
        label: day.toLocaleDateString(undefined, { weekday: 'short' }),
        count: byDate.get(key) || 0,
      });
    }
    return days;
  }, [stats?.requestsPerDay]);

  const loading = statsQuery.isLoading;
  const recentLoading = quotesQuery.isLoading || messagesQuery.isLoading;

  return (
    <div>
      <PageHeader title="Dashboard" description="A quick look at today's leads and content." />

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {STAT_CARDS.map(({ key, label, icon: Icon, tint }) => (
          <Card key={key} className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${tint}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
              {loading ? (
                <div className="h-7 w-12 mt-1 rounded bg-slate-200/70 animate-pulse" />
              ) : (
                <p className="text-2xl font-heading font-extrabold text-[#0F2A55] leading-tight">
                  {stats ? stats[key] : '—'}
                </p>
              )}
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Chart */}
        <Card className="xl:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-heading font-bold text-[#0F2A55]">Requests per Day</h2>
              <p className="text-xs text-slate-500">Quote requests, last 7 days</p>
            </div>
          </div>
          {loading ? (
            <div className="h-64 rounded-xl bg-slate-100 animate-pulse" />
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(245, 158, 11, 0.08)' }}
                    contentStyle={{
                      borderRadius: 12,
                      border: '1px solid #e2e8f0',
                      fontSize: 12,
                      boxShadow: '0 4px 14px rgba(15, 42, 85, 0.08)',
                    }}
                    formatter={(value) => [value, 'Requests']}
                    labelFormatter={(_label, payload) => payload?.[0]?.payload?.date || ''}
                  />
                  <Bar dataKey="count" fill="#F59E0B" radius={[6, 6, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        {/* Recent requests */}
        <Card flush className="xl:col-span-2 overflow-hidden">
          <div className="px-5 sm:px-6 pt-5 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-base font-heading font-bold text-[#0F2A55]">Recent Requests</h2>
              <p className="text-xs text-slate-500">Latest quotes & messages</p>
            </div>
          </div>
          {recentLoading ? (
            <TableSkeleton rows={5} cols={3} />
          ) : recentRequests.length === 0 ? (
            <EmptyState
              icon={Inbox}
              title="No requests yet"
              description="New quote requests and messages from the website will appear here."
            />
          ) : (
            <ul className="divide-y divide-slate-100 max-h-[17rem] overflow-y-auto">
              {recentRequests.map((row) => (
                <li key={row.id} className="px-5 sm:px-6 py-3 flex items-start gap-3">
                  <Badge tone={row.type === 'Quote' ? 'amber' : 'blue'} className="mt-0.5 shrink-0">
                    {row.type}
                  </Badge>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-700 truncate">{row.who}</p>
                    <p className="text-xs text-slate-500 truncate">{row.detail}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0 mt-0.5">{formatDate(row.createdAt)}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
