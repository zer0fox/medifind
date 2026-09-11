import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Hospital, 
  RouteInfo, 
  UserLocation, 
  FilterState, 
  AppLanguage 
} from './types';
import { 
  INITIAL_HOSPITALS, 
  DEFAULT_USER_LOCATION 
} from './data/hospitalsData';
import { 
  calculateHaversineDistance, 
  fetchOSRMRoute, 
  getTrafficConditions 
} from './services/routingService';

import { Navbar } from './components/Navbar';
import { FilterBar } from './components/FilterBar';
import { HospitalMap } from './components/HospitalMap';
import { HospitalCard } from './components/HospitalCard';
import { ActiveRoutePanel } from './components/ActiveRoutePanel';
import { PdfScraperModal } from './components/PdfScraperModal';
import { LocationPickerModal } from './components/LocationPickerModal';
import { TrafficInfoModal } from './components/TrafficInfoModal';
import { TrafficAnalyticsModal } from './components/TrafficAnalyticsModal';
import { GovSyncModal, GovSyncMeta } from './components/GovSyncModal';
import { initAnalytics, trackEvent } from './services/analytics';

import { 
  Map as MapIcon, 
  List, 
  AlertCircle, 
  Navigation, 
  Phone, 
  Clock, 
  Sparkles,
  Car
} from 'lucide-react';

export default function App() {
  const [lang, setLang] = useState<AppLanguage>('el');
  const [hospitals, setHospitals] = useState<Hospital[]>(INITIAL_HOSPITALS);
  const [userLocation, setUserLocation] = useState<UserLocation>(DEFAULT_USER_LOCATION);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [activeRoute, setActiveRoute] = useState<RouteInfo | null>(null);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);
  const [mobileView, setMobileView] = useState<'split' | 'map' | 'list'>('split');

  // Modals
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isTrafficModalOpen, setIsTrafficModalOpen] = useState(false);
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);
  const [isGovModalOpen, setIsGovModalOpen] = useState(false);
  const [syncMeta, setSyncMeta] = useState<GovSyncMeta | null>(null);

  // Filters State
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    specialty: 'all',
    region: 'all',
    onlyOnDutyTonight: true, // Default to urgent night duty
    onlyPediatric: false,
    onlyTrauma: false,
    sortBy: 'distance'
  });

  const trafficInfo = getTrafficConditions();
  const isEl = lang === 'el';

  // Initialize free traffic and analytics tracking on website mount
  useEffect(() => {
    const cleanup = initAnalytics();
    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  // Fetch backend hospitals on mount (with lazy date-change sync from moh.gov.gr)
  useEffect(() => {
    fetch('/api/hospitals')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.hospitals && data.hospitals.length > 0) {
          setHospitals(data.hospitals);
        }
        if (data && data.meta) {
          setSyncMeta(data.meta);
        }
      })
      .catch((err) => {
        console.log('Using preloaded hospitals dataset:', err);
      });
  }, []);

  // Request browser GPS location on initial load
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            label: isEl ? 'Η τρέχουσα τοποθεσία σας' : 'Your Current Location',
            isCustom: false
          });
        },
        (err) => {
          console.warn('Geolocation permission not granted, using default center:', err);
        },
        { timeout: 7000 }
      );
    }
  }, []);

  // Calculate distance & estimated drive duration for all hospitals
  const hospitalsWithDistances = useMemo(() => {
    const traffic = getTrafficConditions();

    return hospitals.map((hosp) => {
      const distanceKm = calculateHaversineDistance(
        userLocation.lat,
        userLocation.lng,
        hosp.coordinates.lat,
        hosp.coordinates.lng
      );

      // Urban speed estimate ~35km/h with dynamic traffic delay
      const baseDurationMin = Math.max(2, Math.round((distanceKm / 35) * 60));
      const trafficDelayMin = Math.round(
        (distanceKm / 10) * traffic.delayFactorMinPer10Km * (traffic.multiplier - 1)
      );
      const driveDurationMin = baseDurationMin + Math.max(0, trafficDelayMin);

      return {
        ...hosp,
        distanceKm,
        driveDurationMin
      };
    });
  }, [hospitals, userLocation]);

  // Filter and sort hospitals
  const filteredHospitals = useMemo(() => {
    return hospitalsWithDistances
      .filter((hosp) => {
        // Search term filter
        if (filters.search.trim()) {
          const q = filters.search.toLowerCase().trim();
          const matchNameEl = hosp.name.el.toLowerCase().includes(q);
          const matchNameEn = hosp.name.en.toLowerCase().includes(q);
          const matchShort = hosp.shortName.toLowerCase().includes(q);
          const matchAddress = hosp.address.el.toLowerCase().includes(q) || hosp.address.en.toLowerCase().includes(q);
          const matchCity = hosp.city.el.toLowerCase().includes(q) || hosp.city.en.toLowerCase().includes(q);
          if (!matchNameEl && !matchNameEn && !matchShort && !matchAddress && !matchCity) {
            return false;
          }
        }

        // Region filter
        if (filters.region !== 'all' && hosp.region !== filters.region) {
          return false;
        }

        // Night Duty filter
        if (filters.onlyOnDutyTonight && !hosp.isOnDutyTonight) {
          return false;
        }

        // Pediatric filter
        if (filters.onlyPediatric && !hosp.hasPediatricEmergency) {
          return false;
        }

        // Trauma center filter
        if (filters.onlyTrauma && !hosp.hasTraumaCenter) {
          return false;
        }

        // Specialty filter
        if (filters.specialty !== 'all') {
          if (!hosp.specialties.includes(filters.specialty)) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'distance') {
          return (a.distanceKm || 9999) - (b.distanceKm || 9999);
        }
        if (filters.sortBy === 'name') {
          return a.name[lang].localeCompare(b.name[lang], lang === 'el' ? 'el' : 'en');
        }
        if (filters.sortBy === 'region') {
          return a.region.localeCompare(b.region);
        }
        return 0;
      });
  }, [hospitalsWithDistances, filters, lang]);

  // Identify closest on-duty hospital
  const closestOnDuty = useMemo(() => {
    const onDutyHospitals = hospitalsWithDistances.filter((h) => h.isOnDutyTonight);
    if (onDutyHospitals.length === 0) return null;
    return onDutyHospitals.reduce((prev, curr) => {
      return (curr.distanceKm || 9999) < (prev.distanceKm || 9999) ? curr : prev;
    }, onDutyHospitals[0]);
  }, [hospitalsWithDistances]);

  // Request OSRM Turn-by-turn route
  const handleRequestRoute = useCallback(
    async (hospital: Hospital) => {
      setSelectedHospital(hospital);
      setIsLoadingRoute(true);

      try {
        const routeData = await fetchOSRMRoute(
          userLocation.lat,
          userLocation.lng,
          hospital.coordinates.lat,
          hospital.coordinates.lng,
          hospital.shortName || hospital.name[lang]
        );
        setActiveRoute(routeData);

        // Track navigation calculation event
        trackEvent('In-App Navigation Started', {
          hospital: hospital.name.en,
          distanceKm: routeData.distanceKm
        });

        // On mobile, automatically show the map with the active route
        if (window.innerWidth < 1024) {
          setMobileView('map');
        }
      } catch (err) {
        console.error('Failed to get OSRM route:', err);
      } finally {
        setIsLoadingRoute(false);
      }
    },
    [userLocation, lang]
  );

  const handleSelectHospital = (hospital: Hospital) => {
    setSelectedHospital(hospital);
  };

  const handleUpdateFilters = (updated: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      specialty: 'all',
      region: 'all',
      onlyOnDutyTonight: true,
      onlyPediatric: false,
      onlyTrauma: false,
      sortBy: 'distance'
    });
  };

  const countOnDuty = useMemo(() => {
    return hospitals.filter((h) => h.isOnDutyTonight).length;
  }, [hospitals]);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900">
      {/* Navbar */}
      <Navbar
        lang={lang}
        onToggleLang={() => setLang((prev) => (prev === 'el' ? 'en' : 'el'))}
        userLocation={userLocation}
        onOpenLocationPicker={() => setIsLocationModalOpen(true)}
        onOpenPdfScraper={() => setIsPdfModalOpen(true)}
        onOpenTrafficInfo={() => setIsTrafficModalOpen(true)}
        onOpenTrafficAnalytics={() => setIsAnalyticsModalOpen(true)}
        onOpenGovSync={() => setIsGovModalOpen(true)}
        syncMeta={syncMeta}
        trafficLevel={trafficInfo.level}
        trafficDelayMin={trafficInfo.delayFactorMinPer10Km}
      />

      {/* Filter and Search Bar */}
      <FilterBar
        filters={filters}
        onChangeFilters={handleUpdateFilters}
        onResetFilters={handleResetFilters}
        lang={lang}
        totalHospitals={hospitals.length}
        filteredCount={filteredHospitals.length}
        onDutyCount={countOnDuty}
      />

      {/* Mobile Map / List View Switcher */}
      <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-2 flex items-center justify-center gap-2">
        <button
          onClick={() => setMobileView('list')}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition ${
            mobileView === 'list'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <List className="w-3.5 h-3.5" />
          <span>{isEl ? 'Λίστα Νοσοκομείων' : 'Hospitals List'}</span>
          <span className="text-[10px] px-1 rounded bg-black/20">
            {filteredHospitals.length}
          </span>
        </button>

        <button
          onClick={() => setMobileView('map')}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition ${
            mobileView === 'map'
              ? 'bg-red-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <MapIcon className="w-3.5 h-3.5" />
          <span>{isEl ? 'Χάρτης OpenStreetMap' : 'Live Map'}</span>
        </button>
      </div>

      {/* Main App Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Hospital List & Routing Guidance */}
        <div
          className={`lg:col-span-6 xl:col-span-5 flex flex-col space-y-3 ${
            mobileView === 'map' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* Official Greek Ministry of Health Sync Indicator Banner */}
          {syncMeta && (
            <button
              id="moh-sync-banner"
              onClick={() => setIsGovModalOpen(true)}
              className="w-full text-left px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100/90 border border-blue-200 text-blue-950 text-xs flex items-center justify-between transition group shadow-2xs"
            >
              <div className="flex items-center gap-2 truncate">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="font-bold text-blue-900 truncate">
                  {isEl 
                    ? `Εφημερία: ${syncMeta.dutyGroup} (Αττική)` 
                    : `Active Duty: ${syncMeta.dutyGroup} (Attica)`}
                </span>
                <span className="text-[11px] text-blue-600 hidden sm:inline">
                  • {syncMeta.status === 'synced' ? 'moh.gov.gr' : 'ΕΣΥ Cycle'}
                </span>
              </div>
              <span className="text-[11px] font-semibold text-blue-700 group-hover:text-blue-800 shrink-0 ml-2">
                {isEl ? 'Πληροφορίες →' : 'Details →'}
              </span>
            </button>
          )}

          {/* Active Navigation Route Step-by-Step Guidance */}
          {activeRoute && selectedHospital && (
            <ActiveRoutePanel
              route={activeRoute}
              hospital={selectedHospital}
              onClose={() => setActiveRoute(null)}
              lang={lang}
            />
          )}

          {/* Closest On-Duty Emergency Card (Instant Help) */}
          {closestOnDuty && !activeRoute && (
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md flex items-center justify-between gap-3">
              <div>
                <div className="text-[10px] uppercase font-bold tracking-wider text-red-200 flex items-center gap-1 mb-0.5">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                  <span>{isEl ? 'Πλησιέστερο Εφημερεύον Απόψε' : 'Closest On-Duty Tonight'}</span>
                </div>
                <h4 className="font-bold text-sm sm:text-base leading-tight">
                  {closestOnDuty.name[lang]}
                </h4>
                <p className="text-xs text-red-100 mt-0.5 flex items-center gap-2">
                  <span>{closestOnDuty.distanceKm} {isEl ? 'χλμ' : 'km'}</span>
                  <span>&bull;</span>
                  <span>~{closestOnDuty.driveDurationMin} {isEl ? 'λεπτά οδήγησης' : 'mins drive'}</span>
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={`tel:${closestOnDuty.phoneEmergency}`}
                  className="p-2.5 rounded-xl bg-white text-red-700 hover:bg-red-50 transition shadow-xs"
                  title={isEl ? 'Άμεση Κλήση' : 'Call'}
                >
                  <Phone className="w-4 h-4" />
                </a>
                <button
                  id="closest-hospital-route-btn"
                  onClick={() => handleRequestRoute(closestOnDuty)}
                  className="px-3 py-2.5 rounded-xl bg-red-950/40 hover:bg-red-950/60 text-white text-xs font-bold border border-red-400/40 flex items-center gap-1.5 transition"
                >
                  <Navigation className="w-3.5 h-3.5 text-red-200" />
                  <span>{isEl ? 'Διαδρομή' : 'Route'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Hospital Cards List */}
          <div className="space-y-2.5 overflow-y-auto max-h-[calc(100vh-230px)] pr-1">
            {filteredHospitals.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
                <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <h4 className="font-bold text-slate-800 text-sm mb-1">
                  {isEl ? 'Δεν βρέθηκαν νοσοκομεία' : 'No hospitals found'}
                </h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto mb-3">
                  {isEl 
                    ? 'Δοκιμάστε να αλλάξετε τα φίλτρα ειδικοτήτων ή να επιλέξετε άλλη περιφέρεια.' 
                    : 'Try clearing specialty filters or expanding your search to all regions.'}
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition"
                >
                  {isEl ? 'Επαναφορά Όλων των Φίλτρων' : 'Reset All Filters'}
                </button>
              </div>
            ) : (
              filteredHospitals.map((hosp) => (
                <HospitalCard
                  key={hosp.id}
                  hospital={hosp}
                  isSelected={selectedHospital?.id === hosp.id}
                  onSelect={() => handleSelectHospital(hosp)}
                  onRequestRoute={() => handleRequestRoute(hosp)}
                  lang={lang}
                  activeSpecialtyFilter={filters.specialty}
                />
              ))
            )}
          </div>
        </div>

        {/* Right Column: Free Interactive OpenStreetMap & OSRM Engine */}
        <div
          className={`lg:col-span-6 xl:col-span-7 rounded-3xl overflow-hidden shadow-md border border-slate-200 bg-white ${
            mobileView === 'list' ? 'hidden lg:block' : 'block'
          } h-[500px] lg:h-[calc(100vh-170px)] sticky top-28`}
        >
          <HospitalMap
            hospitals={filteredHospitals}
            selectedHospital={selectedHospital}
            onSelectHospital={(hosp) => {
              setSelectedHospital(hosp);
              handleRequestRoute(hosp);
            }}
            userLocation={userLocation}
            activeRoute={activeRoute}
            lang={lang}
            isLoadingRoute={isLoadingRoute}
            onClearRoute={() => setActiveRoute(null)}
          />
        </div>
      </main>

      {/* Modals */}
      <PdfScraperModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        lang={lang}
        onHospitalsUpdated={(newHospitals) => {
          setHospitals(newHospitals);
          setIsPdfModalOpen(false);
        }}
      />

      <LocationPickerModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        currentLocation={userLocation}
        onSelectLocation={(newLocation) => setUserLocation(newLocation)}
        lang={lang}
      />

      <TrafficInfoModal
        isOpen={isTrafficModalOpen}
        onClose={() => setIsTrafficModalOpen(false)}
        lang={lang}
      />

      <TrafficAnalyticsModal
        isOpen={isAnalyticsModalOpen}
        onClose={() => setIsAnalyticsModalOpen(false)}
        lang={lang}
      />

      <GovSyncModal
        isOpen={isGovModalOpen}
        onClose={() => setIsGovModalOpen(false)}
        lang={lang}
        syncMeta={syncMeta}
        onHospitalsUpdated={(newHospitals, meta) => {
          setHospitals(newHospitals);
          setSyncMeta(meta);
        }}
      />
    </div>
  );
}
