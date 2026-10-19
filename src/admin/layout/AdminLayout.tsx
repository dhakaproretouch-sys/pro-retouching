import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  BarChart3,
  Building2,
  FileText,
  FlaskConical,
  FolderOpen,
  HelpCircle,
  Images,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  MessageSquareQuote,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Sparkles,
  Tag,
  X,
} from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import api from '../../lib/api';
import type { ApiResponse, DashboardStats } from '../../lib/types';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  /** Optional unread-count badge (inbox pages) -> DashboardStats field. */
  badgeKey?: 'newQuotes' | 'newFreeTests' | 'unreadMessages';
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: 'Overview',
    items: [{ label: 'Dashboard', path: '/admin', icon: <LayoutDashboard className="w-[18px] h-[18px]" /> }],
  },
  {
    title: 'Content',
    items: [
      { label: 'Hero Slider', path: '/admin/hero-slider', icon: <Images className="w-[18px] h-[18px]" /> },
      { label: 'Services', path: '/admin/services', icon: <Sparkles className="w-[18px] h-[18px]" /> },
      { label: 'Our Works', path: '/admin/our-works', icon: <FolderOpen className="w-[18px] h-[18px]" /> },
      { label: 'Pricing', path: '/admin/pricing', icon: <Tag className="w-[18px] h-[18px]" /> },
      { label: 'Stats', path: '/admin/site-stats', icon: <BarChart3 className="w-[18px] h-[18px]" /> },
      { label: 'Client Logos', path: '/admin/client-logos', icon: <Building2 className="w-[18px] h-[18px]" /> },
      { label: 'FAQ', path: '/admin/faq', icon: <HelpCircle className="w-[18px] h-[18px]" /> },
      { label: 'Testimonials', path: '/admin/testimonials', icon: <MessageSquareQuote className="w-[18px] h-[18px]" /> },
    ],
  },
  {
    title: 'Leads',
    items: [
      { label: 'Quote Requests', path: '/admin/quotes', icon: <FileText className="w-[18px] h-[18px]" />, badgeKey: 'newQuotes' },
      { label: 'Free Test Requests', path: '/admin/free-tests', icon: <FlaskConical className="w-[18px] h-[18px]" />, badgeKey: 'newFreeTests' },
      { label: 'Messages', path: '/admin/messages', icon: <Mail className="w-[18px] h-[18px]" />, badgeKey: 'unreadMessages' },
    ],
  },
  {
    title: 'General',
    items: [
      { label: 'Site Settings', path: '/admin/settings', icon: <Settings className="w-[18px] h-[18px]" /> },
      { label: 'Change Password', path: '/admin/change-password', icon: <KeyRound className="w-[18px] h-[18px]" /> },
    ],
  },
];

const LOGO_MARK = (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

/** Poll unread inbox counts for the sidebar badges (every 60s). */
function useInboxCounts() {
  return useQuery({
    queryKey: ['admin', 'stats', 'nav'],
    queryFn: async () => {
      const res = await api.get<ApiResponse<DashboardStats>>('/admin/stats');
      return res.data.data;
    },
    refetchInterval: 60000,
    staleTime: 30000,
    retry: 1,
  });
}

const CountBadge: React.FC<{ count: number; collapsed: boolean }> = ({ count, collapsed }) => {
  if (!count) return null;
  const display = count > 99 ? '99+' : String(count);
  return (
    <span
      className={`shrink-0 rounded-full bg-red-500 text-white text-[10px] font-bold leading-none ${
        collapsed
          ? 'absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 flex items-center justify-center'
          : 'ml-auto min-w-[20px] h-5 px-1.5 flex items-center justify-center'
      }`}
      aria-label={`${count} unread`}
    >
      {display}
    </span>
  );
};

interface SidebarContentProps {
  collapsed: boolean;
  onNavigate?: () => void;
  counts?: DashboardStats;
}

const SidebarContent: React.FC<SidebarContentProps> = ({ collapsed, onNavigate, counts }) => (
  <div className="flex flex-col h-full">
    {/* Brand */}
    <div className={`flex items-center gap-3 px-5 h-16 shrink-0 border-b border-white/10 ${collapsed ? 'justify-center px-0' : ''}`}>
      <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-[#0F2A55] shadow-md shadow-amber-500/20 shrink-0">
        {LOGO_MARK}
      </div>
      {!collapsed && (
        <div className="min-w-0">
          <p className="text-sm font-heading font-bold text-white leading-tight truncate">Pro Retouching</p>
          <p className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider">Admin Panel</p>
        </div>
      )}
    </div>

    {/* Nav */}
    <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5 sidebar-scrollbar">
      {NAV_GROUPS.map((group) => (
        <div key={group.title}>
          {!collapsed && (
            <p className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              {group.title}
            </p>
          )}
          <ul className="space-y-1">
            {group.items.map((item) => {
              const badgeCount = item.badgeKey && counts ? counts[item.badgeKey] : 0;
              return (
                <li key={item.path} className={badgeCount > 0 && collapsed ? 'relative' : undefined}>
                  <NavLink
                    to={item.path}
                    end={item.path === '/admin'}
                    onClick={onNavigate}
                    title={collapsed ? item.label : undefined}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                        collapsed ? 'justify-center px-0 py-2.5' : 'px-3 py-2.5'
                      } ${
                        isActive
                          ? 'bg-amber-500 text-[#0F2A55] shadow-md shadow-amber-500/20'
                          : 'text-slate-300 hover:bg-white/10 hover:text-white'
                      }`
                    }
                  >
                    {item.icon}
                    {!collapsed && <span className="truncate">{item.label}</span>}
                    {badgeCount > 0 && <CountBadge count={badgeCount} collapsed={collapsed} />}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  </div>
);

/**
 * Admin shell: navy collapsible sidebar (drawer on mobile) + topbar with the
 * signed-in admin's email and a logout button. Public Navbar/Footer are NOT
 * rendered inside /admin routes.
 */
export const AdminLayout: React.FC = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const { data: counts } = useInboxCounts();
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem('adminSidebarCollapsed') === 'true';
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    window.localStorage.setItem('adminSidebarCollapsed', String(collapsed));
  }, [collapsed]);

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setMobileOpen(false);
  }, []);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out');
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex fixed inset-y-0 left-0 z-30 flex-col bg-[#0F2A55] transition-all duration-200 ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        <SidebarContent collapsed={collapsed} counts={counts} />
        <button
          type="button"
          onClick={() => setCollapsed((v) => !v)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-500 hover:text-amber-600 hover:border-amber-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <PanelLeftOpen className="w-3.5 h-3.5" /> : <PanelLeftClose className="w-3.5 h-3.5" />}
        </button>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          />
          <aside className="absolute inset-y-0 left-0 w-72 bg-[#0F2A55] shadow-2xl flex flex-col">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
            <SidebarContent collapsed={false} onNavigate={() => setMobileOpen(false)} counts={counts} />
          </aside>
        </div>
      )}

      {/* Main column */}
      <div className={`flex flex-col min-h-screen transition-all duration-200 ${collapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
        {/* Topbar */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200 h-16 flex items-center justify-between gap-4 px-4 sm:px-6">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden lg:block" />

          <div className="flex items-center gap-3 ml-auto">
            <div className="hidden sm:flex flex-col items-end max-w-[200px]">
              <span className="text-sm font-semibold text-slate-700 truncate">
                {admin?.email || 'Admin'}
              </span>
              <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                {admin?.role || 'administrator'}
              </span>
            </div>
            <div className="w-9 h-9 rounded-full bg-[#0F2A55] flex items-center justify-center text-amber-400 font-bold text-sm shrink-0">
              {(admin?.email || 'A').charAt(0).toUpperCase()}
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-red-600 hover:bg-red-50 border border-slate-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1400px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
