export interface HospitalSpecialty {
  id: string;
  name: {
    el: string;
    en: string;
  };
  iconName: string;
  category: 'primary' | 'surgical' | 'pediatric' | 'specialized';
}

export type HealthDistrict = '1η ΥΠΕ' | '2η ΥΠΕ' | '3η ΥΠΕ' | '4η ΥΠΕ' | '5η ΥΠΕ' | '6η ΥΠΕ' | '7η ΥΠΕ';

export interface Hospital {
  id: string;
  name: {
    el: string;
    en: string;
  };
  shortName: string;
  type: 'General' | 'University' | 'Children' | 'Specialized' | 'Maternity' | 'Psychiatric' | 'Trauma';
  region: 'Attica' | 'Thessaloniki' | 'Crete' | 'Western Greece' | 'Thessaly' | 'Epirus' | 'Macedonia' | 'Peloponnese';
  healthDistrict: HealthDistrict;
  address: {
    el: string;
    en: string;
  };
  city: {
    el: string;
    en: string;
  };
  postalCode: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  phoneEmergency: string;
  phoneGeneral: string;
  website?: string;
  isOnDutyTonight: boolean;
  dutySchedule: {
    date: string;
    hours: {
      el: string;
      en: string;
    };
    group?: string; // e.g. "Ομάδα Α", "Ομάδα Β" in Attica system
    status: 'active' | 'upcoming' | 'standby' | 'closed';
  };
  specialties: string[]; // specialty IDs
  specialtyNotes?: {
    [key: string]: string;
  };
  hasPediatricEmergency: boolean;
  hasTraumaCenter: boolean;
  notes: {
    el: string;
    en: string;
  };
  // Runtime calculated:
  distanceKm?: number;
  driveDurationMin?: number;
}

export interface RouteStep {
  instruction: string;
  distanceMeters: number;
  durationSec: number;
  type?: string;
}

export interface RouteInfo {
  distanceKm: number;
  durationMin: number;
  durationWithTrafficMin: number;
  trafficDelayMin: number;
  trafficLevel: 'low' | 'moderate' | 'heavy';
  coordinates: [number, number][]; // [lat, lng]
  steps: RouteStep[];
  summary: string;
}

export interface UserLocation {
  lat: number;
  lng: number;
  accuracy?: number;
  label?: string;
  isCustom?: boolean;
}

export interface FilterState {
  search: string;
  specialty: string;
  region: string;
  onlyOnDutyTonight: boolean;
  onlyPediatric: boolean;
  onlyTrauma: boolean;
  sortBy: 'distance' | 'name' | 'region';
}

export type AppLanguage = 'el' | 'en';
