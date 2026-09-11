import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Hospital, RouteInfo, UserLocation, AppLanguage } from '../types';
import { Navigation, Locate, Layers, Phone, Clock, ExternalLink } from 'lucide-react';
import { getHospitalMapLinks } from '../utils/mapNavigation';

interface HospitalMapProps {
  hospitals: Hospital[];
  selectedHospital: Hospital | null;
  onSelectHospital: (hospital: Hospital) => void;
  userLocation: UserLocation;
  activeRoute: RouteInfo | null;
  lang: AppLanguage;
  isLoadingRoute: boolean;
  onClearRoute: () => void;
}

export const HospitalMap: React.FC<HospitalMapProps> = ({
  hospitals,
  selectedHospital,
  onSelectHospital,
  userLocation,
  activeRoute,
  lang,
  isLoadingRoute,
  onClearRoute
}) => {
  const isEl = lang === 'el';
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const userAccuracyCircleRef = useRef<L.Circle | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);
  const [mapTheme, setMapTheme] = useState<'standard' | 'night'>('standard');
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [userLocation.lat, userLocation.lng],
      zoom: 12,
      zoomControl: false
    });

    // Add Zoom Control at bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Initial Tile Layer: OpenStreetMap Standard
    const standardTiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    standardTiles.addTo(map);
    tileLayerRef.current = standardTiles;

    const markersGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = markersGroup;

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Tile Layer when theme changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }

    const tileUrl =
      mapTheme === 'night'
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    const attribution =
      mapTheme === 'night'
        ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> & CartoDB'
        : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

    const newLayer = L.tileLayer(tileUrl, { maxZoom: 19, attribution });
    newLayer.addTo(mapInstanceRef.current);
    tileLayerRef.current = newLayer;
  }, [mapTheme]);

  // Update User Marker
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    if (userMarkerRef.current) {
      map.removeLayer(userMarkerRef.current);
    }
    if (userAccuracyCircleRef.current) {
      map.removeLayer(userAccuracyCircleRef.current);
    }

    // Custom pulse HTML icon for user location
    const userIcon = L.divIcon({
      className: 'custom-user-marker',
      html: `
        <div class="relative flex items-center justify-center w-8 h-8">
          <span class="animate-ping absolute inline-flex h-7 w-7 rounded-full bg-sky-400 opacity-60"></span>
          <div class="relative w-5 h-5 rounded-full bg-sky-600 border-2 border-white shadow-lg flex items-center justify-center text-white text-[10px] font-bold">
            •
          </div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    const marker = L.marker([userLocation.lat, userLocation.lng], {
      icon: userIcon,
      zIndexOffset: 1000
    }).addTo(map);

    marker.bindPopup(`
      <div class="p-1 text-slate-800">
        <div class="font-bold text-xs">${isEl ? 'Η τοποθεσία σας' : 'Your Location'}</div>
        <div class="text-[11px] text-slate-600">${userLocation.label || `${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}`}</div>
      </div>
    `);

    userMarkerRef.current = marker;

    const circle = L.circle([userLocation.lat, userLocation.lng], {
      radius: userLocation.accuracy || 300,
      color: '#0284c7',
      fillColor: '#38bdf8',
      fillOpacity: 0.12,
      weight: 1
    }).addTo(map);

    userAccuracyCircleRef.current = circle;
  }, [userLocation, isEl]);

  // Render Hospital Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;
    const markersGroup = markersLayerRef.current;
    markersGroup.clearLayers();

    hospitals.forEach((hosp) => {
      const isSelected = selectedHospital?.id === hosp.id;
      const isOnDuty = hosp.isOnDutyTonight;

      // Color coding:
      // Green = On Duty Tonight
      // Gray/Slate = Not on duty tonight (upcoming)
      const bgColor = isOnDuty ? 'bg-emerald-600' : 'bg-slate-600';
      const ringColor = isSelected ? 'ring-4 ring-rose-500 scale-110' : '';
      const pingPulse = isOnDuty
        ? '<span class="animate-ping absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-400 opacity-75"></span>'
        : '';

      const iconHtml = `
        <div class="relative group cursor-pointer transition-transform duration-200 ${ringColor}">
          ${pingPulse}
          <div class="${bgColor} text-white w-9 h-9 rounded-2xl shadow-md flex items-center justify-center border-2 border-white font-bold text-sm">
            <span>H</span>
          </div>
          ${
            isOnDuty
              ? '<span class="absolute -bottom-1 -right-1 bg-emerald-500 text-white text-[9px] font-bold px-1 rounded-full border border-white">24h</span>'
              : ''
          }
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'hospital-custom-pin',
        html: iconHtml,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        popupAnchor: [0, -18]
      });

      const marker = L.marker([hosp.coordinates.lat, hosp.coordinates.lng], {
        icon: customIcon,
        title: hosp.name[lang]
      });

      marker.on('click', () => {
        onSelectHospital(hosp);
      });

      const mapLinks = getHospitalMapLinks(
        hosp.coordinates.lat, 
        hosp.coordinates.lng, 
        hosp.name[lang]
      );

      // Rich Leaflet popup with device default maps & direct options
      const popupHtml = `
        <div class="p-2.5 min-w-[240px] max-w-[290px] text-slate-900 font-sans">
          <!-- Status header -->
          <div class="flex items-center justify-between gap-1.5 mb-1.5">
            <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${
              isOnDuty ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
            }">
              <span class="w-1.5 h-1.5 rounded-full ${isOnDuty ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}"></span>
              <span>${isOnDuty ? (isEl ? 'Εφημερεύει Τώρα' : 'Open Tonight') : (isEl ? 'Επόμενη Εφημερία' : 'Upcoming Duty')}</span>
            </span>
            <span class="text-[10px] font-medium text-slate-500">${hosp.healthDistrict}</span>
          </div>

          <h3 class="font-bold text-sm leading-snug mb-1 text-slate-900">${hosp.name[lang]}</h3>
          <p class="text-[11px] text-slate-500 mb-2 leading-tight">${hosp.address[lang]}, ${hosp.city[lang]}</p>

          <div class="text-[11px] font-medium text-slate-700 bg-slate-100 px-2 py-1 rounded-lg mb-2.5 flex items-center justify-between">
            <span>🕒 ${hosp.dutySchedule.hours[lang]}</span>
            <a href="tel:${hosp.phoneEmergency}" class="text-red-600 font-bold hover:underline flex items-center gap-1 ml-1" title="${isEl ? 'Κλήση' : 'Call'}">
              ☎️ ${hosp.phoneEmergency}
            </a>
          </div>

          <!-- Device Map Default & External Navigation Options -->
          <div class="border-t border-slate-200 pt-2 space-y-1.5">
            <div class="text-[10px] uppercase font-bold tracking-wider text-slate-500 flex items-center justify-between">
              <span>${isEl ? 'Πλοήγηση Συσκευής' : 'Device Navigation'}</span>
              <span class="text-[9px] text-sky-600 lowercase font-medium">${mapLinks.defaultDeviceName}</span>
            </div>

            <!-- Primary: Device Default Map Button -->
            <a
              href="${mapLinks.defaultDeviceUrl}"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition shadow-xs"
            >
              <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              <span>${isEl ? 'Χάρτες Συσκευής (Default)' : 'Open in Device Maps'}</span>
            </a>

            <!-- Explicit Google Maps & Apple Maps Choice Grid -->
            <div class="grid grid-cols-2 gap-1.5 pt-0.5">
              <a
                href="${mapLinks.googleMapsUrl}"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-semibold border border-slate-200 transition"
              >
                <span>Google Maps</span>
              </a>

              <a
                href="${mapLinks.appleMapsUrl}"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-semibold border border-slate-200 transition"
              >
                <span>Apple Maps</span>
              </a>
            </div>

            <!-- In-App OSRM Option -->
            <button
              type="button"
              data-in-app-route="${hosp.id}"
              class="w-full mt-1 py-1.5 px-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold flex items-center justify-center gap-1 transition"
            >
              <span>🧭 ${isEl ? 'Προβολή Διαδρομής Εδώ' : 'Show Route In-App'}</span>
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        maxWidth: 320,
        className: 'hospital-marker-popup'
      });

      marker.on('popupopen', (e) => {
        const popupElement = e.popup.getElement();
        if (popupElement) {
          const inAppBtn = popupElement.querySelector(`[data-in-app-route="${hosp.id}"]`);
          if (inAppBtn) {
            inAppBtn.addEventListener('click', () => {
              onSelectHospital(hosp);
            });
          }
        }
      });

      markersGroup.addLayer(marker);
    });
  }, [hospitals, selectedHospital, lang, onSelectHospital]);

  // Draw OSRM Route Polyline on Map
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    if (routePolylineRef.current) {
      map.removeLayer(routePolylineRef.current);
      routePolylineRef.current = null;
    }

    if (activeRoute && activeRoute.coordinates.length > 0) {
      // Choose polyline color based on traffic level
      const polyColor =
        activeRoute.trafficLevel === 'heavy'
          ? '#e11d48' // Rose / Red
          : activeRoute.trafficLevel === 'moderate'
            ? '#f59e0b' // Amber
            : '#10b981'; // Emerald Green

      const polyline = L.polyline(activeRoute.coordinates, {
        color: polyColor,
        weight: 6,
        opacity: 0.9,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);

      routePolylineRef.current = polyline;

      // Fit map bounds to view both user location and destination
      map.fitBounds(polyline.getBounds(), {
        padding: [60, 60],
        maxZoom: 15
      });
    } else if (selectedHospital) {
      // Zoom gently to selected hospital
      map.flyTo([selectedHospital.coordinates.lat, selectedHospital.coordinates.lng], 14, {
        duration: 0.8
      });
    }
  }, [activeRoute, selectedHospital]);

  // Recenter to User Location
  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([userLocation.lat, userLocation.lng], 13, { duration: 0.8 });
    }
  };

  // Fit all visible hospitals
  const handleFitAllHospitals = () => {
    if (!mapInstanceRef.current || hospitals.length === 0) return;
    const bounds = L.latLngBounds(
      hospitals.map((h) => [h.coordinates.lat, h.coordinates.lng])
    );
    bounds.extend([userLocation.lat, userLocation.lng]);
    mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
  };

  return (
    <div className="relative w-full h-full min-h-[380px] lg:min-h-[550px] bg-slate-100 overflow-hidden">
      {/* Map DOM Canvas */}
      <div ref={mapContainerRef} className="w-full h-full" id="osm-map-view" />

      {/* Floating Map Controls */}
      <div className="absolute top-3 right-3 z-[1000] flex flex-col gap-2">
        {/* Recenter Button */}
        <button
          id="map-recenter-btn"
          onClick={handleRecenter}
          className="p-2.5 bg-white/95 hover:bg-white text-slate-800 rounded-xl shadow-lg border border-slate-200 transition active:scale-95 flex items-center justify-center backdrop-blur-sm"
          title={isEl ? 'Κεντράρισμα στην τοποθεσία μου' : 'Recenter to my location'}
        >
          <Locate className="w-4 h-4 text-sky-600" />
        </button>

        {/* Fit All Hospitals */}
        <button
          id="map-fit-all-btn"
          onClick={handleFitAllHospitals}
          className="p-2.5 bg-white/95 hover:bg-white text-slate-800 rounded-xl shadow-lg border border-slate-200 transition active:scale-95 flex items-center justify-center backdrop-blur-sm"
          title={isEl ? 'Προβολή όλων των νοσοκομείων' : 'Show all hospitals'}
        >
          <Navigation className="w-4 h-4 text-emerald-600" />
        </button>

        {/* Toggle Theme / Night Tiles */}
        <button
          id="map-theme-toggle-btn"
          onClick={() => setMapTheme(prev => (prev === 'standard' ? 'night' : 'standard'))}
          className="p-2.5 bg-white/95 hover:bg-white text-slate-800 rounded-xl shadow-lg border border-slate-200 transition active:scale-95 flex items-center justify-center backdrop-blur-sm"
          title={isEl ? 'Εναλλαγή νυχτερινού/ημερήσιου χάρτη' : 'Toggle Day/Night map style'}
        >
          <Layers className="w-4 h-4 text-slate-700" />
        </button>
      </div>

      {/* Map Legend Overlay */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 backdrop-blur-sm px-3 py-2 rounded-xl shadow-lg border border-slate-200 text-xs flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-emerald-500 border border-white shadow-sm flex items-center justify-center text-[7px] text-white font-bold">
            H
          </span>
          <span className="font-medium text-slate-700">
            {isEl ? 'Εφημερεύει Τώρα' : 'On Duty Tonight'}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-slate-500 border border-white shadow-sm flex items-center justify-center text-[7px] text-white font-bold">
            H
          </span>
          <span className="text-slate-500">
            {isEl ? 'Επόμενη Εφημερία' : 'Upcoming'}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-sky-500 border border-white shadow-sm"></span>
          <span className="text-slate-600">
            {isEl ? 'Εσείς' : 'You'}
          </span>
        </div>
        <span className="text-[10px] text-slate-400 hidden sm:inline">
          OpenStreetMap &bull; OSRM Free
        </span>
      </div>

      {/* Loading Overlay */}
      {isLoadingRoute && (
        <div className="absolute inset-0 z-[1001] bg-slate-900/30 backdrop-blur-xs flex items-center justify-center">
          <div className="bg-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-200">
            <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs font-semibold text-slate-800">
              {isEl ? 'Υπολογισμός ταχύτερης διαδρομής OSRM...' : 'Calculating quickest OSRM route...'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
