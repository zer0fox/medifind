import React from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  Stethoscope, 
  Baby, 
  Activity, 
  Clock, 
  X,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { FilterState, AppLanguage, HospitalSpecialty } from '../types';
import { REGIONS_LIST, SPECIALTIES } from '../data/hospitalsData';

interface FilterBarProps {
  filters: FilterState;
  onChangeFilters: (updated: Partial<FilterState>) => void;
  onResetFilters: () => void;
  lang: AppLanguage;
  totalHospitals: number;
  filteredCount: number;
  onDutyCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onChangeFilters,
  onResetFilters,
  lang,
  totalHospitals,
  filteredCount,
  onDutyCount
}) => {
  const isEl = lang === 'el';

  const isFiltered = 
    filters.search !== '' ||
    filters.specialty !== 'all' ||
    filters.region !== 'all' ||
    !filters.onlyOnDutyTonight ||
    filters.onlyPediatric ||
    filters.onlyTrauma;

  return (
    <div className="bg-white border-b border-slate-200 px-4 py-3 shadow-xs space-y-3">
      {/* Primary Search and Region Controls */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5">
        {/* Search Input */}
        <div className="md:col-span-6 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            id="hospital-search-input"
            type="text"
            value={filters.search}
            onChange={(e) => onChangeFilters({ search: e.target.value })}
            placeholder={
              isEl 
                ? 'Αναζήτηση νοσοκομείου, οδού ή περιοχής (π.χ. Ευαγγελισμός, Κηφισιά)...' 
                : 'Search hospital, street, or area (e.g., Evaggelismos, Attikon)...'
            }
            className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-red-500 focus:ring-1 focus:ring-red-500 transition"
          />
          {filters.search && (
            <button
              onClick={() => onChangeFilters({ search: '' })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Region Selector */}
        <div className="md:col-span-3 relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <select
            id="region-filter-select"
            value={filters.region}
            onChange={(e) => onChangeFilters({ region: e.target.value })}
            className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-red-500 appearance-none font-medium cursor-pointer"
          >
            {REGIONS_LIST.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name[lang]}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>

        {/* Sort By Selector */}
        <div className="md:col-span-3 relative">
          <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <select
            id="sort-filter-select"
            value={filters.sortBy}
            onChange={(e) => onChangeFilters({ sortBy: e.target.value as any })}
            className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-red-500 appearance-none font-medium cursor-pointer"
          >
            <option value="distance">{isEl ? 'Πλησιέστερο πρώτο (Απόσταση)' : 'Closest First (Distance)'}</option>
            <option value="name">{isEl ? 'Ονομαστική σειρά (Α-Ω)' : 'Alphabetical (A-Z)'}</option>
            <option value="region">{isEl ? 'Κατά Περιφέρεια' : 'By Region'}</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* Specialty Doctor Filter Pills & Quick Toggles */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        {/* Quick Toggles */}
        <div className="flex flex-wrap items-center gap-1.5">
          {/* On-Duty Tonight Toggle (Urgent) */}
          <button
            id="toggle-on-duty-btn"
            onClick={() => onChangeFilters({ onlyOnDutyTonight: !filters.onlyOnDutyTonight })}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
              filters.onlyOnDutyTonight
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{isEl ? 'Εφημερεύουν Απόψε' : 'On-Duty Tonight'}</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              filters.onlyOnDutyTonight ? 'bg-emerald-700 text-emerald-100' : 'bg-slate-200 text-slate-700'
            }`}>
              {onDutyCount}
            </span>
          </button>

          {/* Pediatric Only Toggle */}
          <button
            id="toggle-pediatric-btn"
            onClick={() => onChangeFilters({ onlyPediatric: !filters.onlyPediatric })}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
              filters.onlyPediatric
                ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
            }`}
          >
            <Baby className="w-3.5 h-3.5" />
            <span>{isEl ? 'Παιδιατρικά (Παιδιά)' : 'Pediatrics Only'}</span>
          </button>

          {/* Trauma Center Only */}
          <button
            id="toggle-trauma-btn"
            onClick={() => onChangeFilters({ onlyTrauma: !filters.onlyTrauma })}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
              filters.onlyTrauma
                ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>{isEl ? 'Τραύμα & Κατάγματα' : 'Trauma Centers'}</span>
          </button>
        </div>

        {/* Specialty Dropdown */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Stethoscope className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            <select
              id="specialty-filter-select"
              value={filters.specialty}
              onChange={(e) => onChangeFilters({ specialty: e.target.value })}
              className={`pl-8 pr-7 py-1.5 rounded-lg text-xs font-medium border appearance-none transition cursor-pointer ${
                filters.specialty !== 'all'
                  ? 'bg-red-50 border-red-300 text-red-700 font-bold'
                  : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <option value="all">
                {isEl ? 'Όλες οι Ιατρικές Ειδικότητες' : 'All Doctor Specialties'}
              </option>
              {SPECIALTIES.map((spec) => (
                <option key={spec.id} value={spec.id}>
                  {spec.name[lang]}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>

          {/* Reset Filters */}
          {isFiltered && (
            <button
              id="reset-filters-btn"
              onClick={onResetFilters}
              className="px-2.5 py-1.5 text-xs text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition font-medium flex items-center gap-1"
              title={isEl ? 'Καθαρισμός φίλτρων' : 'Clear filters'}
            >
              <X className="w-3.5 h-3.5" />
              <span>{isEl ? 'Καθαρισμός' : 'Clear'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Result Count Status */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-0.5 border-t border-slate-100">
        <div>
          {isEl ? (
            <span>
              Βρέθηκαν <strong className="text-slate-800">{filteredCount}</strong> νοσοκομεία (από {totalHospitals})
            </span>
          ) : (
            <span>
              Showing <strong className="text-slate-800">{filteredCount}</strong> hospitals (of {totalHospitals})
            </span>
          )}
        </div>
        <div className="text-[11px] text-slate-400">
          {isEl ? 'Αυτόματη ταξινόμηση βάσει GPS' : 'Auto-sorted by your GPS location'}
        </div>
      </div>
    </div>
  );
};
