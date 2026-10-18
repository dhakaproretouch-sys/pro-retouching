/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './components/Toast';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FloatingActions } from './components/FloatingActions';
import { ScrollToTop } from './components/ScrollToTop';

import { Home } from './pages/Home';
import { AboutUs } from './pages/AboutUs';
import { Services } from './pages/Services';
import { ServiceDetail } from './pages/ServiceDetail';
import { Pricing } from './pages/Pricing';
import { OurWorks } from './pages/OurWorks';
import { ContactUs } from './pages/ContactUs';
import { FreeTest } from './pages/FreeTest';

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen text-slate-800 bg-white font-sans">
          <Navbar />
          <main className="flex-1">
            <Routes>
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
            </Routes>
          </main>
          <Footer />
          <FloatingActions />
        </div>
      </BrowserRouter>
    </ToastProvider>
  );
}
