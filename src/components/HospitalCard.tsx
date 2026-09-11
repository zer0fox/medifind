import React from 'react';
import { 
  Hospital, 
  AppLanguage 
} from '../types';
import { 
  MapPin, 
  Phone, 
  Navigation, 
  Clock, 
  Car, 
  Baby, 
  Activity, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { SPECIALTIES } from '../data/hospitalsData';
import { getHospitalMapLinks } from '../utils/mapNavigation';

interface HospitalCardProps {
  hospital: Hospital;
  isSelected: boolean;
  onSelect: () => void;
  onRequestRoute: () => void;
  lang: AppLanguage;
  activeSpecialtyFilter?: string;
}

export const HospitalCard: React.FC<HospitalCardProps> = ({
  hospital,
  isSelected,
  onSelect,
  onRequestRoute,
  lang,
  activeSpecialtyFilter
}) => {
  const isEl = lang === 'el';
  const isOnDuty = hospital.isOnDutyTonight;

  // External Maps Links for real driving in emergency
  const mapLinks = getHospitalMapLinks(
    hospital.coordinates.lat,
    hospital.coordinates.lng,
    hospital.name[lang]
  );

  // Get matching specialties names
  const specialtyNames = hospital.specialties
    .map(sId => SPECIALTIES.find(s => s.id === sId))
    .filter(Boolean);

  return (
    <div
      id={`hospital-card-${hospital.id}`}
      onClick={onSelect}
      className={`relative p-4 rounded-2xl transition-all cursor-pointer border ${
        isSelected
          ? 'bg-red-50/40 border-red-500 shadow-md ring-2 ring-red-500/20'
          : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs'
      }`}
    >
      {/* Top Meta Bar */}
      <div className="flex items-start justify-between gap-2 mb-2">
        {/* Status Pill */}
        <div className="flex items-center gap-1.5">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
            isOnDuty
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-slate-100 text-slate-600 border-slate-200'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isOnDuty ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
            <span>
              {isOnDuty 
                ? (isEl ? 'Εφημερεύει Τώρα' : 'Open Tonight') 
                : (isEl ? 'Επόμενη Εφημερία' : 'Upcoming Duty')}
            </span>
          </span>

          <span className="text-[11px] font-medium text-slate-500 px-2 py-0.5 rounded-md bg-slate-100">
            {hospital.healthDistrict}
          </span>
          {hospital.dutySchedule.group && (
            <span className="text-[11px] font-medium text-indigo-700 px-1.5 py-0.5 rounded-md bg-indigo-50 border border-indigo-100 hidden sm:inline">
              {hospital.dutySchedule.group}
            </span>
          )}
        </div>

        {/* Proximity / Distance & ETA */}
        {hospital.distanceKm !== undefined && (
          <div className="text-right shrink-0">
            <div className="flex items-center gap-1 text-xs font-bold text-slate-900 justify-end">
              <MapPin className="w-3.5 h-3.5 text-red-500" />
              <span>{hospital.distanceKm} {isEl ? 'χλμ' : 'km'}</span>
            </div>
            {hospital.driveDurationMin !== undefined && (
              <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold justify-end">
                <Car className="w-3 h-3" />
                <span>~{hospital.driveDurationMin} {isEl ? 'λεπτά' : 'mins'}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Hospital Name & Type */}
      <div className="mb-2">
        <h3 className="font-bold text-base text-slate-900 leading-snug group-hover:text-red-700 transition">
          {hospital.name[lang]}
        </h3>
        <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
          <span>{hospital.address[lang]}</span>
          <span>&bull;</span>
          <span className="font-medium text-slate-700">{hospital.city[lang]}</span>
        </p>
      </div>

      {/* Duty Hours & Highlights */}
      <div className="bg-slate-50 rounded-xl p-2.5 mb-3 border border-slate-100 text-xs text-slate-700 space-y-1">
        <div className="flex items-center gap-1.5 font-medium text-slate-800">
          <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span>{hospital.dutySchedule.hours[lang]}</span>
        </div>
        {hospital.notes[lang] && (
          <p className="text-[11px] text-slate-600 leading-relaxed pl-5">
            {hospital.notes[lang]}
          </p>
        )}
      </div>

      {/* Badges: Pediatric, Trauma */}
      <div className="flex flex-wrap items-center gap-1.5 mb-3">
        {hospital.hasPediatricEmergency && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            <Baby className="w-3 h-3 text-purple-600" />
            <span>{isEl ? 'Παιδιατρικά Επείγοντα' : 'Pediatric ER'}</span>
          </span>
        )}
        {hospital.hasTraumaCenter && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <Activity className="w-3 h-3 text-rose-600" />
            <span>{isEl ? 'Κέντρο Τραύματος' : 'Trauma Center'}</span>
          </span>
        )}

        {/* Doctor Specialties Badges */}
        {specialtyNames.slice(0, 4).map((spec: any) => {
          const isHighlighted = activeSpecialtyFilter === spec.id;
          return (
            <span
              key={spec.id}
              className={`text-[10px] px-1.5 py-0.5 rounded-md font-medium border ${
                isHighlighted
                  ? 'bg-red-100 text-red-800 border-red-300 font-bold'
                  : 'bg-white text-slate-600 border-slate-200'
              }`}
            >
              {spec.name[lang].split('(')[0].trim()}
            </span>
          );
        })}
        {specialtyNames.length > 4 && (
          <span className="text-[10px] text-slate-400 font-medium px-1">
            +{specialtyNames.length - 4} {isEl ? 'ειδικότητες' : 'more'}
          </span>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
        {/* Direct Call Hospital */}
        <a
          href={`tel:${hospital.phoneEmergency}`}
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold transition active:scale-95"
          title={isEl ? 'Κλήση Επειγόντων' : 'Call Emergency'}
        >
          <Phone className="w-3.5 h-3.5 text-red-600" />
          <span>{hospital.phoneEmergency}</span>
        </a>

        {/* Action Right: OSRM Route & External Nav */}
        <div className="flex items-center gap-1.5 flex-wrap justify-end">
          {/* Default Device Map Button */}
          <a
            href={mapLinks.defaultDeviceUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 px-2.5 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-semibold border border-sky-200 transition"
            title={`${isEl ? 'Άνοιγμα στους Χάρτες της Συσκευής' : 'Open in Default Device Maps'} (${mapLinks.defaultDeviceName})`}
          >
            <Compass className="w-3.5 h-3.5 text-sky-600" />
            <span className="hidden sm:inline">{mapLinks.defaultDeviceName}</span>
            <ExternalLink className="w-3 h-3 text-sky-500 sm:hidden" />
          </a>

          {/* Quickest Route Button (OSRM on Leaflet Map) */}
          <button
            id={`route-btn-${hospital.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onRequestRoute();
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition active:scale-95"
          >
            <Navigation className="w-3.5 h-3.5 text-sky-400" />
            <span>{isEl ? 'Διαδρομή OSRM' : 'OSRM Route'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
