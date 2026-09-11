import React from 'react';
import { 
  Car, 
  X, 
  Clock, 
  AlertTriangle, 
  ShieldCheck, 
  Navigation,
  Info
} from 'lucide-react';
import { AppLanguage } from '../types';
import { getTrafficConditions } from '../services/routingService';

interface TrafficInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: AppLanguage;
}

export const TrafficInfoModal: React.FC<TrafficInfoModalProps> = ({
  isOpen,
  onClose,
  lang
}) => {
  const isEl = lang === 'el';
  if (!isOpen) return null;

  const currentTraffic = getTrafficConditions();

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 leading-tight">
              {isEl ? 'Πραγματικός Χρόνος Κίνησης & OSRM' : 'Real-Time Traffic & OSRM Routing'}
            </h2>
            <p className="text-xs text-slate-500">
              {isEl ? 'Υπολογισμός ταχύτερης πρόσβασης χωρίς κόστος API' : 'Zero-cost routing & dynamic traffic delay engine'}
            </p>
          </div>
        </div>

        {/* Current Live Traffic Status Card */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {isEl ? 'Τρέχουσα Κατάσταση Δικτύου' : 'Current Network Condition'}
            </span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
              currentTraffic.level === 'low'
                ? 'bg-emerald-100 text-emerald-800'
                : currentTraffic.level === 'moderate'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-rose-100 text-rose-800'
            }`}>
              {currentTraffic.level === 'low'
                ? (isEl ? 'Ομαλή Κυκλοφορία' : 'Smooth Flow')
                : currentTraffic.level === 'moderate'
                  ? (isEl ? 'Μέτρια Κίνηση' : 'Moderate Traffic')
                  : (isEl ? 'Συμφορημένη' : 'Heavy Congestion')}
            </span>
          </div>
          <p className="text-sm font-semibold text-slate-800 mb-2">
            {currentTraffic.description[lang]}
          </p>

          <div className="text-xs text-slate-600 space-y-1 pt-2 border-t border-slate-200">
            {currentTraffic.incidents.map((inc, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                <span>{inc[lang]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div className="space-y-2.5 text-xs text-slate-600 mb-5">
          <div className="flex items-start gap-2">
            <Navigation className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-800 block">
                {isEl ? '100% Δωρεάν & Ανοικτά Δεδομένα' : '100% Free & Open-Source'}
              </strong>
              <span>
                {isEl
                  ? 'Χρησιμοποιούμε OpenStreetMap και τη μηχανή OSRM (Open Source Routing Machine). Δεν απαιτούνται συνδρομές ή επί πληρωμή API.'
                  : 'Powered by OpenStreetMap and the OSRM routing engine. No paid APIs or subscription keys.'}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Clock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-800 block">
                {isEl ? 'Νυχτερινή Διέλευση Επείγοντος' : 'Night Emergency Transit'}
              </strong>
              <span>
                {isEl
                  ? 'Τις νυχτερινές ώρες (22:00 - 06:00), ο αλγόριθμος αναγνωρίζει την ελεύθερη ροή των κεντρικών αρτηριών για ταχύτατη μετάβαση.'
                  : 'During night hours (22:00 - 06:00), the model accounts for rapid transit corridors with minimal intersection delays.'}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-800 block">
                {isEl ? 'Σε περίπτωση Έκτακτης Ανάγκης' : 'In Severe Emergencies'}
              </strong>
              <span>
                {isEl
                  ? 'Καλέστε άμεσα το 166 (ΕΚΑΒ). Μην οδηγείτε εάν αντιμετωπίζετε κρίσιμο ή επικίνδυνο σύμπτωμα.'
                  : 'Immediately dial 166 (EKAB) or 112. Do not attempt to drive if you are experiencing severe symptoms.'}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition"
        >
          {isEl ? 'Κατάλαβα' : 'Got it'}
        </button>
      </div>
    </div>
  );
};
