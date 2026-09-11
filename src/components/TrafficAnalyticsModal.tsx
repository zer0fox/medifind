import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  X, 
  Users, 
  Eye, 
  Smartphone, 
  Monitor, 
  Tablet, 
  Globe, 
  RefreshCw, 
  Activity, 
  ShieldCheck, 
  PhoneCall, 
  Navigation, 
  Sparkles,
  ExternalLink,
  Code2
} from 'lucide-react';
import { AppLanguage } from '../types';
import { fetchAnalyticsStats } from '../services/analytics';

interface TrafficAnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: AppLanguage;
}

export const TrafficAnalyticsModal: React.FC<TrafficAnalyticsModalProps> = ({
  isOpen,
  onClose,
  lang
}) => {
  const isEl = lang === 'el';
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'external'>('overview');

  const loadStats = async () => {
    setIsLoading(true);
    const data = await fetchAnalyticsStats();
    if (data) {
      setStats(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      loadStats();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const today = stats?.today || { pageviews: 0, uniqueVisitors: 0, hourly: [] };
  const hourlyData: number[] = Array.isArray(today.hourly) 
    ? today.hourly.map((v: any) => Number(v) || 0) 
    : new Array(24).fill(0);
  const maxHourly = Math.max(1, ...hourlyData);

  const devices = stats?.devices || { mobile: 0, desktop: 0, tablet: 0 };
  const totalDeviceCount = Math.max(1, (devices.mobile || 0) + (devices.desktop || 0) + (devices.tablet || 0));

  const referrers = stats?.referrers || {};
  const referrerVals: number[] = Object.values(referrers).map((v: any) => Number(v) || 0);
  const totalReferrerCount = Math.max(1, referrerVals.reduce((a, b) => a + b, 0));

  const actions = stats?.actions || {};

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full p-5 sm:p-6 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 leading-tight">
                {isEl ? 'Στατιστικά Επισκεψιμότητας MediFind' : 'MediFind Traffic & Analytics'}
              </h2>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{stats?.activeNow || 1} {isEl ? 'Online Τώρα' : 'Active Now'}</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEl 
                ? '100% Δωρεάν, ενσωματωμένη καταγραφή χωρίς cookies ή εξωτερικές χρεώσεις' 
                : '100% Free, privacy-first built-in traffic tracking with zero cookies or fees'}
            </p>
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="flex rounded-xl bg-slate-100 p-1 mb-5 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-1.5 rounded-lg transition ${
              activeTab === 'overview'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {isEl ? 'Ζωντανά Στατιστικά' : 'Live Dashboard'}
          </button>
          <button
            onClick={() => setActiveTab('external')}
            className={`flex-1 py-1.5 rounded-lg transition ${
              activeTab === 'external'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {isEl ? 'Δωρεάν Εξωτερικοί Trackers (GoatCounter, Cloudflare, GA4)' : 'Free External Trackers Guide'}
          </button>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-5">
            {/* KPI Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-[11px] font-bold uppercase">{isEl ? 'Σήμερα' : 'Today Views'}</span>
                  <Eye className="w-3.5 h-3.5 text-sky-500" />
                </div>
                <div className="text-xl font-black text-slate-900">
                  {today.pageviews}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {today.uniqueVisitors} {isEl ? 'μοναδικοί' : 'uniques'}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-[11px] font-bold uppercase">{isEl ? 'Σύνολο' : 'All-Time'}</span>
                  <Activity className="w-3.5 h-3.5 text-indigo-500" />
                </div>
                <div className="text-xl font-black text-slate-900">
                  {stats?.totalPageviews || 0}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {isEl ? 'προβολές σελίδας' : 'total pageviews'}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <span className="text-[11px] font-bold uppercase">{isEl ? 'Επισκέπτες' : 'Visitors'}</span>
                  <Users className="w-3.5 h-3.5 text-emerald-500" />
                </div>
                <div className="text-xl font-black text-slate-900">
                  {stats?.totalUniqueVisitors || 0}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {isEl ? 'ανώνυμα IDs' : 'anonymized'}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                <div className="flex items-center justify-between text-emerald-700 mb-1">
                  <span className="text-[11px] font-bold uppercase">{isEl ? 'Live' : 'Active Now'}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                </div>
                <div className="text-xl font-black text-emerald-800">
                  {stats?.activeNow || 1}
                </div>
                <div className="text-[10px] text-emerald-600 mt-0.5">
                  {isEl ? 'συνδεδεμένοι χρήστες' : 'current sessions'}
                </div>
              </div>
            </div>

            {/* Today Hourly Activity Chart */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  {isEl ? 'Ωριαία Κίνηση Σήμερα (00:00 - 23:00)' : "Today's Hourly Traffic (24h)"}
                </div>
                <span className="text-[11px] text-slate-400">
                  {isEl ? 'Ώρα Ελλάδος' : 'Local Time'}
                </span>
              </div>

              {/* Bar Chart Container */}
              <div className="h-28 flex items-end gap-1 sm:gap-1.5 pt-4 pb-1 px-1 border-b border-slate-200">
                {hourlyData.map((val: number, h: number) => {
                  const pct = Math.round((val / maxHourly) * 100);
                  const isCurrentHour = new Date().getHours() === h;
                  return (
                    <div
                      key={h}
                      className="flex-1 flex flex-col items-center group relative h-full justify-end"
                    >
                      {/* Tooltip */}
                      <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition pointer-events-none bg-slate-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap z-10 shadow-sm">
                        {h}:00 - {val} {isEl ? 'επισκέψεις' : 'visits'}
                      </div>
                      <div
                        style={{ height: `${Math.max(8, pct)}%` }}
                        className={`w-full rounded-t transition-all ${
                          isCurrentHour
                            ? 'bg-emerald-500'
                            : val > 0
                              ? 'bg-sky-500 hover:bg-sky-400'
                              : 'bg-slate-200'
                        }`}
                      ></div>
                    </div>
                  );
                })}
              </div>

              {/* Hour X-Axis Labels */}
              <div className="flex justify-between text-[9px] text-slate-400 mt-1.5 px-0.5 font-mono">
                <span>00:00</span>
                <span>06:00</span>
                <span>12:00</span>
                <span>18:00</span>
                <span>23:00</span>
              </div>
            </div>

            {/* Referrers & Devices Columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Traffic Sources / Referrers */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                  <Globe className="w-3.5 h-3.5 text-sky-500" />
                  <span>{isEl ? 'Πηγές Επισκεπτών (Referrers)' : 'Traffic Sources'}</span>
                </div>

                <div className="space-y-2 text-xs">
                  {Object.entries(referrers).map(([source, count]: [string, any], idx) => {
                    const pct = Math.round((Number(count) / totalReferrerCount) * 100);
                    return (
                      <div key={idx}>
                        <div className="flex justify-between text-slate-700 mb-0.5">
                          <span className="font-medium truncate max-w-[170px]">{source}</span>
                          <span className="font-bold text-slate-900">{count} ({pct}%)</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-sky-500 rounded-full"
                            style={{ width: `${pct}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Devices & Platforms */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                  <Smartphone className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{isEl ? 'Συσκευές Χρηστών' : 'User Devices'}</span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div>
                    <div className="flex items-center justify-between text-slate-700 mb-1">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Smartphone className="w-3.5 h-3.5 text-slate-500" />
                        <span>{isEl ? 'Κινητά (Mobile)' : 'Mobile'}</span>
                      </span>
                      <span className="font-bold">
                        {devices.mobile} ({Math.round(((devices.mobile || 0) / totalDeviceCount) * 100)}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${Math.round(((devices.mobile || 0) / totalDeviceCount) * 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-slate-700 mb-1">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Monitor className="w-3.5 h-3.5 text-slate-500" />
                        <span>{isEl ? 'Υπολογιστές (Desktop)' : 'Desktop'}</span>
                      </span>
                      <span className="font-bold">
                        {devices.desktop} ({Math.round(((devices.desktop || 0) / totalDeviceCount) * 100)}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full"
                        style={{ width: `${Math.round(((devices.desktop || 0) / totalDeviceCount) * 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-slate-700 mb-1">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Tablet className="w-3.5 h-3.5 text-slate-500" />
                        <span>{isEl ? 'Τάμπλετ (Tablet)' : 'Tablet'}</span>
                      </span>
                      <span className="font-bold">
                        {devices.tablet} ({Math.round(((devices.tablet || 0) / totalDeviceCount) * 100)}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full"
                        style={{ width: `${Math.round(((devices.tablet || 0) / totalDeviceCount) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Hospital Actions */}
            {Object.keys(actions).length > 0 && (
              <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-200">
                <div className="text-xs font-bold uppercase tracking-wider text-rose-800 mb-2 flex items-center gap-1.5">
                  <PhoneCall className="w-3.5 h-3.5 text-rose-600" />
                  <span>{isEl ? 'Ενέργειες Επείγουσας Ανάγκης που έγιναν κλικ' : 'Emergency Action Conversions'}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {Object.entries(actions).map(([act, count], i) => (
                    <div key={i} className="bg-white p-2 rounded-xl border border-rose-100">
                      <div className="text-[11px] text-slate-500 truncate">{act}</div>
                      <div className="text-base font-extrabold text-rose-700 mt-0.5">{String(count)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Free External Trackers Guide */}
        {activeTab === 'external' && (
          <div className="space-y-4 text-xs text-slate-600">
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800">
              <div className="flex items-center gap-1.5 font-bold mb-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{isEl ? 'Η ενσωματωμένη καταγραφή είναι ήδη ενεργή & 100% δωρεάν' : 'Built-in tracking is already active & 100% free'}</span>
              </div>
              <p className="text-[11px] text-emerald-700 leading-relaxed">
                {isEl
                  ? 'Το MediFind καταγράφει αυτόματα τις επισκέψεις, τις συσκευές και τις πηγές χωρίς να χρειάζεται να πληρώσετε τίποτα και χωρίς cookies. Εάν θέλετε επίσης έναν εξωτερικό δωρεάν πάροχο, δείτε τις παρακάτω 3 κορυφαίες δωρεάν επιλογές:'
                  : 'MediFind automatically tracks pageviews, devices, and referrers directly on your server with zero fees and no cookies. If you also want a third-party analytics provider, here are 3 recommended 100% free options:'}
              </p>
            </div>

            {/* Option 1: GoatCounter */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <span>1. GoatCounter</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                    {isEl ? '100% Δωρεάν & Ανοικτό Λογισμικό' : '100% Free & Open-Source'}
                  </span>
                </div>
                <a
                  href="https://www.goatcounter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:underline flex items-center gap-1 font-semibold text-[11px]"
                >
                  <span>goatcounter.com</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <p className="text-slate-500 text-[11px]">
                {isEl
                  ? 'Εντελώς δωρεάν για έως 100.000 προβολές/μήνα, χωρίς διαφημίσεις, χωρίς tracking cookies (συμβατό με GDPR). Για ενεργοποίηση, ορίστε στο .env:'
                  : 'Free hosted analytics for up to 100k views/mo, privacy-friendly, zero cookies. To enable, simply declare in your settings/.env:'}
              </p>
              <div className="bg-slate-900 text-slate-200 p-2.5 rounded-xl font-mono text-[11px]">
                VITE_GOATCOUNTER_CODE=&quot;my-medifind-site&quot;
              </div>
            </div>

            {/* Option 2: Cloudflare Web Analytics */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <span>2. Cloudflare Web Analytics</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 font-semibold">
                    {isEl ? 'Απεριόριστο & Δωρεάν' : 'Free & Unlimited'}
                  </span>
                </div>
                <a
                  href="https://www.cloudflare.com/web-analytics/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:underline flex items-center gap-1 font-semibold text-[11px]"
                >
                  <span>cloudflare.com</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <p className="text-slate-500 text-[11px]">
                {isEl
                  ? '100% δωρεάν, χωρίς όριο επισκέψεων, χωρίς cookies, με ταχύτατο CDN script.'
                  : '100% free, privacy-first, unlimited pageviews with zero cookie banners required.'}
              </p>
            </div>

            {/* Option 3: Google Analytics 4 */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <span>3. Google Analytics 4 (GA-4)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold">
                    {isEl ? 'Δωρεάν από τη Google' : 'Free by Google'}
                  </span>
                </div>
                <a
                  href="https://analytics.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:underline flex items-center gap-1 font-semibold text-[11px]"
                >
                  <span>analytics.google.com</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <p className="text-slate-500 text-[11px]">
                {isEl
                  ? 'Εάν έχετε λογαριασμό Google Analytics, απλά προσθέστε το Measurement ID (π.χ. G-XXXXXXX) στο .env:'
                  : 'If you have a Google Analytics property, just set the Measurement ID in your settings/.env:'}
              </p>
              <div className="bg-slate-900 text-slate-200 p-2.5 rounded-xl font-mono text-[11px]">
                VITE_GA_MEASUREMENT_ID=&quot;G-XXXXXXXXXX&quot;
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-3 pt-4 mt-5 border-t border-slate-200 text-xs">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>{isEl ? 'GDPR & ePrivacy Compliant' : 'GDPR & ePrivacy Compliant'}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadStats}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isEl ? 'Ανανέωση' : 'Refresh'}</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition"
            >
              {isEl ? 'Κλείσιμο' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
