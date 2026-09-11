import React from 'react';
import { RouteInfo, Hospital, AppLanguage } from '../types';
import { 
  Navigation, 
  Car, 
  Phone, 
  Clock, 
  X, 
  CornerDownRight, 
  ExternalLink,
  ShieldAlert,
  ArrowUp,
  RotateCcw,
  Compass
} from 'lucide-react';
import { getHospitalMapLinks } from '../utils/mapNavigation';

interface ActiveRoutePanelProps {
  route: RouteInfo;
  hospital: Hospital;
  onClose: () => void;
  lang: AppLanguage;
}

export const ActiveRoutePanel: React.FC<ActiveRoutePanelProps> = ({
  route,
  hospital,
  onClose,
  lang
}) => {
  const isEl = lang === 'el';
  const mapLinks = getHospitalMapLinks(
    hospital.coordinates.lat,
    hospital.coordinates.lng,
    hospital.name[lang]
  );

  const trafficBadge =
    route.trafficLevel === 'low'
      ? { text: isEl ? 'Ομαλή Ροή' : 'Clear Road', bg: 'bg-emerald-100 text-emerald-800' }
      : route.trafficLevel === 'moderate'
        ? { text: isEl ? `Καθυστέρηση +${route.trafficDelayMin}λ` : `Delay +${route.trafficDelayMin}m`, bg: 'bg-amber-100 text-amber-900' }
        : { text: isEl ? `Έντονη Κίνηση +${route.trafficDelayMin}λ` : `Heavy Traffic +${route.trafficDelayMin}m`, bg: 'bg-rose-100 text-rose-900' };

  return (
    <div className="bg-slate-900 text-white rounded-2xl shadow-xl border border-slate-800 p-4 mb-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400">
              {isEl ? 'Ενεργή Πλοήγηση' : 'Active Navigation'}
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${trafficBadge.bg}`}>
              {trafficBadge.text}
            </span>
          </div>
          <h3 className="font-bold text-base text-white leading-tight">
            {hospital.name[lang]}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {hospital.address[lang]}, {hospital.city[lang]}
          </p>
          <p className="text-[11px] text-sky-300/80 mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
            {isEl 
              ? 'Η εφαρμογή σας καθοδηγεί απευθείας — δεν απαιτείται το Google Maps.' 
              : 'The app navigates you directly — no need to use Google Maps.'}
          </p>
        </div>

        <button
          id="close-route-btn"
          onClick={onClose}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          title={isEl ? 'Κλείσιμο διαδρομής' : 'Close route'}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-3 gap-2 py-3 border-b border-slate-800 text-center">
        <div className="bg-slate-800/60 p-2 rounded-xl">
          <div className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
            <Navigation className="w-3 h-3 text-sky-400" />
            <span>{isEl ? 'Απόσταση' : 'Distance'}</span>
          </div>
          <div className="text-lg font-extrabold text-white mt-0.5">
            {route.distanceKm} <span className="text-xs font-normal text-slate-400">{isEl ? 'χλμ' : 'km'}</span>
          </div>
        </div>

        <div className="bg-slate-800/60 p-2 rounded-xl">
          <div className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
            <Clock className="w-3 h-3 text-emerald-400" />
            <span>{isEl ? 'Εκτιμώμενη Ώρα' : 'Estimated Time'}</span>
          </div>
          <div className="text-lg font-extrabold text-emerald-400 mt-0.5">
            ~{route.durationWithTrafficMin} <span className="text-xs font-normal text-emerald-300">{isEl ? 'λεπτά' : 'min'}</span>
          </div>
        </div>

        <div className="bg-slate-800/60 p-2 rounded-xl">
          <div className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
            <Car className="w-3 h-3 text-amber-400" />
            <span>{isEl ? 'Κυκλοφορία' : 'Traffic'}</span>
          </div>
          <div className="text-sm font-bold text-slate-200 mt-1">
            {route.trafficDelayMin > 0 ? `+${route.trafficDelayMin} ${isEl ? 'λ. καθυστέρηση' : 'm delay'}` : (isEl ? 'Ελεύθερη' : 'Smooth')}
          </div>
        </div>
      </div>

      {/* Turn-by-Turn Steps Preview */}
      <div className="py-2.5 max-h-40 overflow-y-auto pr-1 space-y-2 text-xs">
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
          {isEl ? 'Οδηγίες Διαδρομής Βήμα-προς-Βήμα' : 'Turn-by-Turn Driving Directions'}
        </div>
        {route.steps.slice(0, 5).map((step, idx) => (
          <div key={idx} className="flex items-start gap-2 text-slate-300 bg-slate-800/40 p-1.5 rounded-lg">
            <CornerDownRight className="w-3.5 h-3.5 text-sky-400 mt-0.5 shrink-0" />
            <div className="flex-1 leading-snug">
              <span>{step.instruction}</span>
              {step.distanceMeters > 0 && (
                <span className="text-[10px] text-slate-500 block">
                  {step.distanceMeters >= 1000 ? `${(step.distanceMeters / 1000).toFixed(1)} χλμ` : `${step.distanceMeters} μ.`}
                </span>
              )}
            </div>
          </div>
        ))}
        {route.steps.length > 5 && (
          <div className="text-center text-[11px] text-slate-500 italic">
            +{route.steps.length - 5} {isEl ? 'επιπλέον οδηγίες' : 'more maneuvers'}
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-3 border-t border-slate-800">
        <a
          href={`tel:${hospital.phoneEmergency}`}
          className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition shadow-sm"
        >
          <Phone className="w-3.5 h-3.5" />
          <span>{isEl ? 'Τηλέφωνο Επειγόντων' : 'Call ER'}</span>
        </a>

        <div className="flex items-center gap-1.5 flex-wrap justify-end">
          {/* Default Device Map Button */}
          <a
            href={mapLinks.defaultDeviceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition shadow-xs"
            title={`${isEl ? 'Άνοιγμα στους Χάρτες της Συσκευής' : 'Open in Default Device Maps'} (${mapLinks.defaultDeviceName})`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>{isEl ? 'Χάρτες Συσκευής' : 'Device Maps'}</span>
          </a>

          {/* Google Maps link */}
          <a
            href={mapLinks.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
          >
            <span>Google</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>

          {/* Apple Maps link */}
          <a
            href={mapLinks.appleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
          >
            <span>Apple</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        </div>
      </div>
    </div>
  );
};
