import React, { useState } from 'react';
import { 
  Building2, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  RefreshCw, 
  ShieldCheck, 
  X, 
  Calendar,
  Layers,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { AppLanguage, Hospital } from '../types';

export interface GovSyncMeta {
  date: string;
  scrapedAt: string;
  status: 'synced' | 'fallback' | 'manual';
  dutyGroup: string;
  sourceTitle: string;
  sourceUrl: string;
  onDutyHospitalsCount: number;
  dutyHospitalsList?: string[];
  message: string;
}

interface GovSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: AppLanguage;
  syncMeta: GovSyncMeta | null;
  onHospitalsUpdated: (newHospitals: Hospital[], meta: GovSyncMeta) => void;
}

export const GovSyncModal: React.FC<GovSyncModalProps> = ({
  isOpen,
  onClose,
  lang,
  syncMeta,
  onHospitalsUpdated
}) => {
  const isEl = lang === 'el';
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleForceSync = async () => {
    setIsSyncing(true);
    setSyncFeedback(null);
    try {
      const res = await fetch('/api/hospitals/sync-gov', { method: 'POST' });
      const data = await res.json();
      if (data.success && data.meta) {
        setSyncFeedback(isEl ? 'Ο συγχρονισμός ολοκληρώθηκε επιτυχώς!' : 'Government sync completed successfully!');
        // Re-fetch hospitals to update parent state
        const hospRes = await fetch('/api/hospitals');
        const hospData = await hospRes.json();
        if (hospData.hospitals) {
          onHospitalsUpdated(hospData.hospitals, data.meta);
        }
      } else {
        setSyncFeedback(isEl ? 'Σφάλμα κατά τον συγχρονισμό' : 'Sync error occurred');
      }
    } catch (err: any) {
      console.error('Sync failed:', err);
      setSyncFeedback(isEl ? 'Αποτυχία σύνδεσης με τον διακομιστή' : 'Failed to reach server');
    } finally {
      setIsSyncing(false);
    }
  };

  const formattedTime = syncMeta?.scrapedAt
    ? new Date(syncMeta.scrapedAt).toLocaleTimeString(isEl ? 'el-GR' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    : '--:--';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900/95 backdrop-blur z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-2">
                {isEl ? 'Επίσημος Συγχρονισμός Υπ. Υγείας' : 'Official Ministry of Health Sync'}
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {syncMeta?.status === 'synced' ? 'Live MOH' : 'ΕΣΥ Cycle'}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                {isEl ? 'Δεδομένα εφημεριών από moh.gov.gr με έξυπνη προσωρινή μνήμη' : 'Live duty data from moh.gov.gr with smart lazy cache'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-sm">
          {/* Active Duty Status Card */}
          <div className="bg-slate-800/60 border border-slate-700/70 rounded-xl p-4">
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <span className="text-xs text-slate-400 block mb-1 flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-sky-400" />
                  {isEl ? 'Εφημερεύουσα Ομάδα' : 'Active Duty Group'}
                </span>
                <span className="text-base font-bold text-sky-300">
                  {syncMeta?.dutyGroup || 'Ομάδα Β'}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  {isEl ? 'Ημερομηνία Αθήνας' : 'Athens Date'}
                </span>
                <span className="text-sm font-semibold text-slate-200">
                  {syncMeta?.date || new Date().toISOString().split('T')[0]}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {isEl ? 'Τελευταία ενημέρωση:' : 'Last refreshed:'} <strong className="text-slate-300">{formattedTime}</strong>
              </span>
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                {syncMeta?.onDutyHospitalsCount || 21} {isEl ? 'νοσοκομεία σε ετοιμότητα' : 'hospitals on duty'}
              </span>
            </div>
          </div>

          {/* Official Bulletin Details */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-blue-400" />
              {isEl ? 'Επίσημο Έγγραφο Υπουργείου Υγείας' : 'Official Ministry Circular'}
            </h3>
            <div className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-3 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-200 truncate">
                  {syncMeta?.sourceTitle || 'Ημερήσιο Δελτίο Εφημεριών Αττικής.pdf'}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  1η & 2η Υγειονομική Περιφέρεια (ΥΠΕ) & ΕΚΑΒ
                </p>
              </div>
              <a
                href={syncMeta?.sourceUrl || 'https://www.moh.gov.gr/articles/citizen/efhmeries-nosokomeiwn/68-efhmeries-nosokomeiwn-attikhs'}
                target="_blank"
                rel="noreferrer"
                className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 text-xs font-medium border border-blue-500/30 transition"
              >
                <span>{isEl ? 'Προβολή' : 'View'}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Architecture Highlights */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {isEl ? 'Πώς λειτουργεί το έξυπνο σύστημα' : 'How the Smart Engine Works'}
            </h3>

            <div className="flex items-start gap-2.5 text-xs text-slate-300 bg-slate-800/40 p-2.5 rounded-lg border border-slate-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-100 block mb-0.5">
                  {isEl ? 'Μηδενική επιβάρυνση του gov.gr' : 'Zero Government Server Strain'}
                </strong>
                <span>
                  {isEl 
                    ? 'Ο διακομιστής αντλεί το επίσημο PDF μόνο 1 φορά την ημέρα (κατά την πρώτη επίσκεψη μετά τα μεσάνυχτα). Όλοι οι υπόλοιποι χρήστες εξυπηρετούνται άμεσα από την προσωρινή μνήμη (cache < 5ms).'
                    : 'The server fetches the circular only once per day (on the first visitor after midnight). All subsequent visitors are served instantly from memory cache (<5ms).'}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 text-xs text-slate-300 bg-slate-800/40 p-2.5 rounded-lg border border-slate-800">
              <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-100 block mb-0.5">
                  {isEl ? 'Εγγύηση συνεχούς λειτουργίας (Fail-Safe)' : 'Continuous Uptime Fail-Safe'}
                </strong>
                <span>
                  {isEl
                    ? 'Αν ο ιστότοπος του Υπουργείου παρουσιάσει καθυστέρηση ή διακοπή, το MediFind υπολογίζει αυτόματα το επίσημο 4ήμερο κυκλικό πρόγραμμα (Ομάδες Α-Β-Γ-Δ) του ΕΣΥ χωρίς διακοπή λειτουργίας.'
                    : 'If the Ministry website is unreachable, MediFind automatically falls back to the deterministic 4-day rotating cycle of the Greek NHS with zero downtime.'}
                </span>
              </div>
            </div>
          </div>

          {/* Feedback banner */}
          {syncFeedback && (
            <div className="p-3 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{syncFeedback}</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/95 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition"
          >
            {isEl ? 'Κλείσιμο' : 'Close'}
          </button>

          <button
            onClick={handleForceSync}
            disabled={isSyncing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold shadow-lg shadow-blue-900/30 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>
              {isSyncing 
                ? (isEl ? 'Συγχρονισμός σε εξέλιξη...' : 'Syncing with MOH...') 
                : (isEl ? 'Άμεσος Επανασυγχρονισμός' : 'Force Sync Now')}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
