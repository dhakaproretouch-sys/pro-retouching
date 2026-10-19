/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { ToastProvider } from './components/Toast';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FloatingActions } from './components/FloatingActions';
import { ScrollToTop } from './components/ScrollToTop';
import { SkeletonBlock } from './components/Skeleton';

// Eagerly loaded: Home page + above-the-fold chrome for fast first paint.
import { Home } from './pages/Home';

// Public pages (route-level, lazy).
const AboutUs = lazy(() => import('./pages/AboutUs').then((m) => ({ default: m.AboutUs })));
const Services = lazy(() => import('./pages/Services').then((m) => ({ default: m.Services })));
const ServiceDetail = lazy(() =>
  import('./pages/ServiceDetail').then((m) => ({ default: m.ServiceDetail }))
);
const Pricing = lazy(() => import('./pages/Pricing').then((m) => ({ default: m.Pricing })));
const OurWorks = lazy(() => import('./pages/OurWorks').then((m) => ({ default: m.OurWorks })));
const ContactUs = lazy(() => import('./pages/ContactUs').then((m) => ({ default: m.ContactUs })));
const FreeTest = lazy(() => import('./pages/FreeTest').then((m) => ({ default: m.FreeTest })));

// Admin (lazy: public visitors never download admin pages, recharts or dnd-kit).
// AuthProvider / ProtectedRoute stay eager — tiny, and AuthProvider wraps the app root.
import { AuthProvider } from './admin/auth/AuthContext';
import { ProtectedRoute } from './admin/auth/ProtectedRoute';
const AdminLayout = lazy(() =>
  import('./admin/layout/AdminLayout').then((m) => ({ default: m.AdminLayout }))
);
const AdminLogin = lazy(() =>
  import('./admin/pages/AdminLogin').then((m) => ({ default: m.AdminLogin }))
);
const Dashboard = lazy(() =>
  import('./admin/pages/Dashboard').then((m) => ({ default: m.Dashboard }))
);
const HeroSliderManager = lazy(() =>
  import('./admin/pages/HeroSliderManager').then((m) => ({ default: m.HeroSliderManager }))
);
const ServicesManager = lazy(() =>
  import('./admin/pages/ServicesManager').then((m) => ({ default: m.ServicesManager }))
);
const WorksManager = lazy(() =>
  import('./admin/pages/WorksManager').then((m) => ({ default: m.WorksManager }))
);
const PricingManager = lazy(() =>
  import('./admin/pages/PricingManager').then((m) => ({ default: m.PricingManager }))
);
const StatsManager = lazy(() =>
  import('./admin/pages/StatsManager').then((m) => ({ default: m.StatsManager }))
);
const LogosManager = lazy(() =>
  import('./admin/pages/LogosManager').then((m) => ({ default: m.LogosManager }))
);
const FaqManager = lazy(() =>
  import('./admin/pages/FaqManager').then((m) => ({ default: m.FaqManager }))
);
const TestimonialsManager = lazy(() =>
  import('./admin/pages/TestimonialsManager').then((m) => ({ default: m.TestimonialsManager }))
);
const SiteSettingsPage = lazy(() =>
  import('./admin/pages/SiteSettingsPage').then((m) => ({ default: m.SiteSettingsPage }))
);
const ChangePasswordPage = lazy(() =>
  import('./admin/pages/ChangePasswordPage').then((m) => ({ default: m.ChangePasswordPage }))
);
const QuotesInbox = lazy(() =>
  import('./admin/pages/QuotesInbox').then((m) => ({ default: m.QuotesInbox }))
);
const FreeTestsInbox = lazy(() =>
  import('./admin/pages/FreeTestsInbox').then((m) => ({ default: m.FreeTestsInbox }))
);
const MessagesInbox = lazy(() =>
  import('./admin/pages/MessagesInbox').then((m) => ({ default: m.MessagesInbox }))
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

/** Public site chrome: Navbar + Footer (admin routes never render this). */
const PublicLayout: React.FC = () => (
  <div className="flex flex-col min-h-screen text-slate-800 bg-white font-sans">
    <Navbar />
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
    <FloatingActions />
  </div>
);

/** Route-level Suspense fallback: skeleton block matching existing loaders. */
const RouteFallback: React.FC = () => (
  <div className="min-h-screen bg-white">
    <SkeletonBlock className="w-full h-16 rounded-none" />
    <SkeletonBlock className="w-full max-w-6xl h-96 mx-auto mt-12" />
  </div>
);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  borderRadius: '12px',
                  fontSize: '13px',
                  fontWeight: 600,
                  boxShadow: '0 10px 30px rgba(15, 42, 85, 0.15)',
                },
                success: { iconTheme: { primary: '#F59E0B', secondary: '#fff' } },
                error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
              }}
            />

              <Suspense fallback={<RouteFallback />}>
                <Routes>
                  {/* ---------------- Admin ---------------- */}
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute>
                        <AdminLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<Dashboard />} />
                    <Route path="hero-slider" element={<HeroSliderManager />} />
                    <Route path="services" element={<ServicesManager />} />
                    <Route path="our-works" element={<WorksManager />} />
                    <Route path="pricing" element={<PricingManager />} />
                    <Route path="site-stats" element={<StatsManager />} />
                    <Route path="client-logos" element={<LogosManager />} />
                    <Route path="faq" element={<FaqManager />} />
                    <Route path="testimonials" element={<TestimonialsManager />} />
                    <Route path="settings" element={<SiteSettingsPage />} />
                    <Route path="quotes" element={<QuotesInbox />} />
                    <Route path="free-tests" element={<FreeTestsInbox />} />
                    <Route path="messages" element={<MessagesInbox />} />
                    <Route path="change-password" element={<ChangePasswordPage />} />
                    <Route path="*" element={<Navigate to="/admin" replace />} />
                  </Route>

                  {/* ---------------- Public site ---------------- */}
                  <Route element={<PublicLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<AboutUs />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/services/:slug" element={<ServiceDetail />} />
                    <Route path="/pricing" element={<Pricing />} />
                    <Route path="/our-works" element={<OurWorks />} />
                    <Route path="/contact" element={<ContactUs />} />
                    <Route path="/free-test" element={<FreeTest />} />
                    {/* Catch-all fallback */}
                    <Route path="*" element={<Home />} />
                  </Route>
                </Routes>
              </Suspense>
            </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
}