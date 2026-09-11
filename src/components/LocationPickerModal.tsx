import React, { useState } from 'react';
import { 
  MapPin, 
  Locate, 
  X, 
  Check, 
  Compass,
  AlertCircle
} from 'lucide-react';
import { AppLanguage, UserLocation } from '../types';
import { POPULAR_LOCATIONS } from '../data/hospitalsData';

interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation: UserLocation;
  onSelectLocation: (location: UserLocation) => void;
  lang: AppLanguage;
}

export const LocationPickerModal: React.FC<LocationPickerModalProps> = ({
  isOpen,
  onClose,
  currentLocation,
  onSelectLocation,
  lang
}) => {
  const isEl = lang === 'el';
  const [isLocating, setIsLocating] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRequestGPS = () => {
    if (!navigator.geolocation) {
      setGpsError(isEl ? 'Η συσκευή σας δεν υποστηρίζει εντοπισμό GPS.' : 'Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        onSelectLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          label: isEl ? 'Ακριβής Τοποθεσία GPS' : 'Live GPS Location',
          isCustom: false
        });
        onClose();
      },
      (error) => {
        setIsLocating(false);
        console.warn('Geolocation error:', error);
        setGpsError(
          isEl
            ? 'Δεν ήταν δυνατή η ανάκτηση της τοποθεσίας σας. Βεβαιωθείτε ότι επιτρέπετε την πρόσβαση στην τοποθεσία ή επιλέξτε μία από τις πόλεις παρακάτω.'
            : 'Could not access GPS. Please allow location permissions or pick a city below.'
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000
      }
    );
  };

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
          <div className="w-11 h-11 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 leading-tight">
              {isEl ? 'Επιλογή Τοποθεσίας Χρήστη' : 'Set Your Location'}
            </h2>
            <p className="text-xs text-slate-500">
              {isEl 
                ? 'Χρησιμοποιείται για την εύρεση των πλησιέστερων εφημερευόντων νοσοκομείων' 
                : 'Used to calculate distances and route to closest hospitals'}
            </p>
          </div>
        </div>

        {/* GPS Button */}
        <div className="mb-4">
          <button
            id="use-browser-gps-btn"
            onClick={handleRequestGPS}
            disabled={isLocating}
            className="w-full py-3 px-4 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition active:scale-98"
          >
            <Locate className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
            <span>
              {isLocating 
                ? (isEl ? 'Εντοπισμός μέσω GPS...' : 'Locating via GPS...') 
                : (isEl ? 'Χρήση Αυτόματης Τοποθεσίας (GPS)' : 'Use Live GPS Location')}
            </span>
          </button>

          {gpsError && (
            <div className="mt-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>{gpsError}</span>
            </div>
          )}
        </div>

        {/* Popular Locations in Greece */}
        <div className="border-t border-slate-100 pt-4">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
            {isEl ? 'Ή Επιλέξτε Περιοχή στην Ελλάδα' : 'Or Select a Region / City'}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
            {POPULAR_LOCATIONS.map((loc, idx) => {
              const isSelected =
                Math.abs(currentLocation.lat - loc.lat) < 0.005 &&
                Math.abs(currentLocation.lng - loc.lng) < 0.005;

              return (
                <button
                  key={idx}
                  onClick={() => {
                    onSelectLocation({
                      lat: loc.lat,
                      lng: loc.lng,
                      label: isEl ? loc.label : loc.enLabel,
                      isCustom: true
                    });
                    onClose();
                  }}
                  className={`p-2.5 rounded-xl text-left text-xs font-medium border flex items-center justify-between transition ${
                    isSelected
                      ? 'bg-sky-50 border-sky-500 text-sky-900 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{isEl ? loc.label : loc.enLabel}</span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-sky-600 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
