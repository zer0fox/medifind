import React from 'react';
import { 
  Hospital, 
  MapPin, 
  PhoneCall, 
  FileText, 
  Car, 
  Languages, 
  AlertCircle,
  Clock,
  Compass,
  BarChart3,
  Building2,
  Lock
} from 'lucide-react';
import { AppLanguage, UserLocation } from '../types';
import { GovSyncMeta } from './GovSyncModal';

interface NavbarProps {
  lang: AppLanguage;
  onToggleLang: () => void;
  userLocation: UserLocation;
  onOpenLocationPicker: () => void;
  onOpenPdfScraper: () => void;
  onOpenTrafficInfo: () => void;
  onOpenTrafficAnalytics: () => void;
  onOpenGovSync?: () => void;
  syncMeta?: GovSyncMeta | null;
  trafficLevel: 'low' | 'moderate' | 'heavy';
  trafficDelayMin: number;
  onLockApp?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  onToggleLang,
  userLocation,
  onOpenLocationPicker,
  onOpenPdfScraper,
  onOpenTrafficInfo,
  onOpenTrafficAnalytics,
  onOpenGovSync,
  syncMeta,
  trafficLevel,
  trafficDelayMin,
  onLockApp
}) => {
  const isEl = lang === 'el';

  const trafficColor = 
    trafficLevel === 'low' 
      ? 'bg-emerald-500 text-emerald-950 border-emerald-300' 
      : trafficLevel === 'moderate' 
        ? 'bg-amber-400 text-amber-950 border-amber-300' 
        : 'bg-rose-500 text-white border-rose-300';

  const trafficLabel = 
    trafficLevel === 'low' 
      ? (isEl ? 'Ομαλή Κυκλοφορία' : 'Smooth Traffic') 
      : trafficLevel === 'moderate' 
        ? (isEl ? `Μέτρια Κίνηση (+${trafficDelayMin || 3}λ)` : `Moderate (+${trafficDelayMin || 3}m)`) 
        : (isEl ? `Έντονη Κίνηση (+${trafficDelayMin || 8}λ)` : `Heavy Delay (+${trafficDelayMin || 8}m)`);

  return (
    <header className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      {/* Emergency Hotline Header Banner */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 px-4 py-1.5 text-xs text-white flex items-center justify-between font-medium">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          <span>
            {isEl 
              ? 'Επείγοντα Περιστατικά Ελλάδας: ' 
              : 'Greece Medical Emergencies: '}
          </span>
          <a 
            href="tel:166" 
            className="font-bold underline hover:text-red-100 flex items-center gap-1 bg-red-800/60 px-2 py-0.5 rounded"
          >
            <PhoneCall className="w-3 h-3" />
            166 (ΕΚΑΒ)
          </a>
          <span className="text-red-200">|</span>
          <a 
            href="tel:112" 
            className="font-bold underline hover:text-red-100 bg-red-800/60 px-2 py-0.5 rounded"
          >
            112 (EU SOS)
          </a>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-red-100 text-xs">
          <Clock className="w-3 h-3" />
          <span>{isEl ? 'Νυχτερινές Εφημερίες σε Ισχύ' : 'Night On-Duty Rosters Active'}</span>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
        {/* Title / Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-md shadow-red-900/40 shrink-0">
            <Hospital className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-base sm:text-lg leading-tight tracking-tight flex items-center gap-2">
              <span className="font-extrabold tracking-tight">MediFind</span>
              <span className="text-xs text-slate-400 font-medium hidden md:inline">
                {isEl ? '• Εφημερεύοντα Νοσοκομεία' : '• Night Hospitals Greece'}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                {isEl ? 'Live Χάρτης' : 'Live Map'}
              </span>
            </h1>
            <p className="text-xs text-slate-400 hidden sm:block">
              {isEl 
                ? 'Εύρεση πλησιέστερου εφημερεύοντος νοσοκομείου με ζωντανή πλοήγηση & κίνηση' 
                : 'Locate closest night emergency hospital with live navigation & traffic'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* User Location Badge */}
          <button
            id="location-picker-btn"
            onClick={onOpenLocationPicker}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 transition"
            title={isEl ? 'Αλλαγή τοποθεσίας χρήστη' : 'Change user location'}
          >
            <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span className="max-w-[120px] sm:max-w-[160px] truncate font-medium">
              {userLocation.label || (isEl ? 'Η τοποθεσία μου' : 'My location')}
            </span>
            <Compass className="w-3 h-3 text-slate-400 ml-0.5 shrink-0" />
          </button>

          {/* Traffic Monitor Status */}
          <button
            id="traffic-info-btn"
            onClick={onOpenTrafficInfo}
            className={`hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border ${trafficColor} transition`}
            title={isEl ? 'Πληροφορίες πραγματικού χρόνου κίνησης' : 'Real-time traffic status'}
          >
            <Car className="w-3.5 h-3.5" />
            <span>{trafficLabel}</span>
          </button>

          {/* Government Live Sync Badge */}
          {onOpenGovSync && (
            <button
              id="gov-sync-btn"
              onClick={onOpenGovSync}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-950/40 hover:bg-blue-900/50 text-blue-300 border border-blue-500/30 text-xs font-semibold shadow-xs transition"
              title={isEl ? 'Επίσημος συγχρονισμός εφημεριών από moh.gov.gr' : 'Official duty roster sync from moh.gov.gr'}
            >
              <Building2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span className="hidden sm:inline">
                moh.gov.gr {syncMeta?.dutyGroup ? `(${syncMeta.dutyGroup.replace('Ομάδα ', 'Ομ. ')})` : ''}
              </span>
              <span className="sm:hidden">MOH</span>
            </button>
          )}

          {/* Official PDF Document Scraper */}
          <button
            id="pdf-scraper-btn"
            onClick={onOpenPdfScraper}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-sm transition"
            title={isEl ? 'Εισαγωγή & Ανάλυση Επίσημου PDF Εφημεριών' : 'Scrape & Normalize Official PDF Schedule'}
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {isEl ? 'Εισαγωγή PDF' : 'Import PDF'}
            </span>
          </button>

          {/* Website Traffic & Analytics Tracker */}
          <button
            id="traffic-analytics-btn"
            onClick={onOpenTrafficAnalytics}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 border border-emerald-500/30 text-xs font-semibold shadow-xs transition"
            title={isEl ? 'Στατιστικά Επισκεψιμότητας Ιστοσελίδας' : 'Website Traffic & Visitor Analytics'}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden lg:inline">{isEl ? 'Επισκεψιμότητα' : 'Traffic'}</span>
          </button>

          {/* Language Switch */}
          <button
            id="lang-toggle-btn"
            onClick={onToggleLang}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 border border-slate-700 font-bold transition"
            title={isEl ? 'Αλλαγή σε Αγγλικά' : 'Switch to Greek'}
          >
            <Languages className="w-3.5 h-3.5 text-amber-400" />
            <span>{isEl ? 'EN' : 'ΕΛ'}</span>
          </button>

          {/* Lock App / Session Reset */}
          {onLockApp && (
            <button
              id="lock-app-btn"
              onClick={onLockApp}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-amber-300 border border-slate-700 transition"
              title={isEl ? 'Κλείδωμα συνεδρίας (Επαναφορά κωδικού)' : 'Lock app session (Reset password)'}
            >
              <Lock className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
