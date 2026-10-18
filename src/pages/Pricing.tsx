import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Check,
  ChevronDown,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Percent,
  HelpCircle,
} from 'lucide-react';
import { PRICING_PLANS, BULK_DISCOUNT_TIERS, FAQ_ITEMS } from '../data/constants';

export const Pricing: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header Banner */}
      <section className="bg-gradient-to-b from-amber-50/70 via-rose-50/30 to-white py-16 sm:py-20 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-amber-600 font-bold text-xs uppercase tracking-wider block mb-2">
            Transparent Commercial Rates
          </span>
          <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-[#0F2A55] tracking-tight">
            Simple, Predictable Image Pricing
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            No hidden fees, no subscriptions required. Pay only for the images you need edited with volume discounts up to 30%.
          </p>
        </div>
      </section>

      {/* Pricing Cards (3 Tables) */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {PRICING_PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 relative ${
                  plan.popular
                    ? 'bg-[#0F2A55] text-white shadow-2xl border-2 border-amber-500 scale-105 z-10'
                    : 'bg-white text-slate-900 border border-slate-200/80 shadow-md hover:shadow-xl'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-xs uppercase tracking-wider px-4 py-1 rounded-full shadow-md">
                    Most Popular Choice
                  </div>
                )}

                <div>
                  <h3
                    className={`text-2xl font-heading font-bold ${
                      plan.popular ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {plan.title}
                  </h3>
                  <p
                    className={`mt-2 text-xs sm:text-sm leading-relaxed ${
                      plan.popular ? 'text-slate-300' : 'text-slate-500'
                    }`}
                  >
                    {plan.description}
                  </p>

                  {/* Price Tag */}
                  <div className="mt-6 flex items-baseline gap-1.5 pb-6 border-b border-slate-200/30">
                    <span
                      className={`text-4xl sm:text-5xl font-heading font-extrabold tracking-tight ${
                        plan.popular ? 'text-amber-400' : 'text-[#0F2A55]'
                      }`}
                    >
                      {plan.price}
                    </span>
                    <span
                      className={`text-xs sm:text-sm font-medium ${
                        plan.popular ? 'text-slate-300' : 'text-slate-500'
                      }`}
                    >
                      / {plan.unit}
                    </span>
                  </div>

                  {/* Best For Tag */}
                  <div className="mt-4 text-xs font-medium">
                    <span className={plan.popular ? 'text-amber-300' : 'text-amber-600'}>
                      Ideal for:{' '}
                    </span>
                    <span className={plan.popular ? 'text-slate-200' : 'text-slate-600'}>
                      {plan.bestFor}
                    </span>
                  </div>

                  {/* Features list */}
                  <div className="mt-6 space-y-3">
                    {plan.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-xs sm:text-sm">
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                            plan.popular
                              ? 'bg-amber-500/20 text-amber-400'
                              : 'bg-amber-100 text-amber-600'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                        <span className={plan.popular ? 'text-slate-200' : 'text-slate-700'}>
                          {feat}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-200/20">
                  <Link
                    to="/free-test"
                    className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-orange-500/30'
                        : 'bg-[#0F2A55] hover:bg-[#1A3E75] text-white shadow-sm'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Try Sample Free</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Volume Bulk Discount Tiers */}
      <section className="py-16 bg-white border-y border-slate-200/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-amber-600 font-bold text-xs uppercase tracking-wider block mb-2">
              High-Volume Savings
            </span>
            <h2 className="text-3xl font-heading font-extrabold text-[#0F2A55] tracking-tight">
              Bulk Catalog Discount Tiers
            </h2>
            <p className="mt-2 text-slate-600 text-sm">
              The more images you process each month, the more you save. Consolidated monthly billing available for verified enterprise sellers.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#0F2A55] text-white text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6 font-semibold">Monthly / Batch Volume</th>
                  <th className="py-4 px-6 font-semibold">Discount Applied</th>
                  <th className="py-4 px-6 font-semibold hidden sm:table-cell">Benefits & Support</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {BULK_DISCOUNT_TIERS.map((tier, idx) => (
                  <tr key={idx} className="hover:bg-amber-50/50 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900">{tier.tier}</td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1 font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md">
                        <Percent className="w-3.5 h-3.5" />
                        {tier.discount}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-600 hidden sm:table-cell">{tier.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Payment Methods */}
          <div className="mt-12 p-6 rounded-2xl bg-slate-50 border border-slate-200/70 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Flexible Global Payment Methods</h4>
                <p className="text-xs text-slate-500">We accept PayPal, Wire Transfer, Payoneer, Visa, and Mastercard in USD, EUR, and GBP.</p>
              </div>
            </div>
            <Link
              to="/contact"
              className="px-5 py-2.5 bg-white text-[#0F2A55] hover:border-amber-400 border border-slate-200 font-semibold text-xs rounded-xl shadow-sm whitespace-nowrap transition-colors"
            >
              Discuss Net-30 Invoicing →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-20 bg-[#F8FAFC]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-amber-600 font-bold text-xs uppercase tracking-wider block mb-2">
              Common Questions
            </span>
            <h2 className="text-3xl font-heading font-extrabold text-[#0F2A55] tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-slate-600 text-sm">
              Everything you need to know about our photo editing service, turnaround, and free trial.
            </p>
          </div>

          <div className="space-y-4">
            {FAQ_ITEMS.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 focus:outline-none"
                  aria-expanded={openFaqIndex === idx}
                >
                  <span className="font-heading font-bold text-base text-slate-900">
                    {item.question}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-slate-600 transition-transform duration-200 ${
                      openFaqIndex === idx ? 'rotate-180 bg-amber-100 text-amber-600' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {openFaqIndex === idx && (
                  <div className="px-5 pb-5 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100 animate-in fade-in duration-150">
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Bottom Free Test Bar */}
          <div className="mt-16 text-center">
            <p className="text-slate-600 text-sm mb-4">
              Still have questions about image formats, resolution, or volume deadlines?
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/free-test"
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold text-sm rounded-xl shadow-md hover:from-amber-600 hover:to-orange-600 transition-all"
              >
                Start Free Trial (2–3 Images)
              </Link>
              <Link
                to="/contact"
                className="px-6 py-3 bg-white text-[#0F2A55] border border-slate-200 hover:bg-slate-50 font-semibold text-sm rounded-xl transition-all"
              >
                Contact Project Manager
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
