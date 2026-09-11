import { RouteInfo, RouteStep } from '../types';

// Calculate Haversine distance in kilometers between two points
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// Compute dynamic traffic delay factor for Greece based on hour of the day and road conditions
export function getTrafficConditions(): {
  multiplier: number;
  delayFactorMinPer10Km: number;
  level: 'low' | 'moderate' | 'heavy';
  description: { el: string; en: string };
  incidents: { el: string; en: string }[];
} {
  const now = new Date();
  // Athens timezone approximation or local browser time
  const hour = now.getHours();
  const day = now.getDay(); // 0 is Sunday, 6 is Saturday

  // Night hours (22:00 - 06:30): usually smooth emergency corridor
  if (hour >= 22 || hour < 6) {
    return {
      multiplier: 1.05,
      delayFactorMinPer10Km: 1,
      level: 'low',
      description: {
        el: 'Νυχτερινή ομαλή κυκλοφορία. Ελεύθερη διέλευση ασθενοφόρων & οχημάτων.',
        en: 'Late night smooth flow. Clear emergency corridors.'
      },
      incidents: [
        { el: 'Κεντρικές λεωφόροι ανοικτές χωρίς καθυστερήσεις.', en: 'Major avenues open with no congestion.' }
      ]
    };
  }

  // Morning rush hour (07:30 - 10:30)
  if (hour >= 7 && hour <= 10 && day >= 1 && day <= 5) {
    return {
      multiplier: 1.45,
      delayFactorMinPer10Km: 7,
      level: 'heavy',
      description: {
        el: 'Πρωινή ώρα αιχμής. Σημαντικές καθυστερήσεις στις κεντρικές αρτηρίες.',
        en: 'Morning rush hour. Notable congestion on major arterials.'
      },
      incidents: [
        { el: 'Αυξημένη κίνηση σε Κηφισίας, Μεσογείων & Αθηνών-Λαμίας.', en: 'Congestion on Kifisias, Mesogeion & Ethniki.' },
        { el: 'Καθυστερήσεις στα φανάρια προς κέντρο.', en: 'Delays at downtown intersections.' }
      ]
    };
  }

  // Afternoon rush hour (14:30 - 16:30)
  if (hour >= 14 && hour <= 16) {
    return {
      multiplier: 1.25,
      delayFactorMinPer10Km: 4,
      level: 'moderate',
      description: {
        el: 'Μεσημεριανή κίνηση / αλλαγή βάρδιας νοσοκομείων.',
        en: 'Afternoon traffic & hospital shift changes.'
      },
      incidents: [
        { el: 'Πυκνή ροή γύρω από τις υγειονομικές ζώνες.', en: 'Dense traffic near medical districts.' }
      ]
    };
  }

  // Evening rush hour (17:30 - 20:30)
  if (hour >= 17 && hour <= 20) {
    return {
      multiplier: 1.4,
      delayFactorMinPer10Km: 6,
      level: 'heavy',
      description: {
        el: 'Απογευματινή κίνηση επιστροφής. Αυξημένος χρόνος διαδρομής.',
        en: 'Evening commute peak. Increased driving time.'
      },
      incidents: [
        { el: 'Καθυστερήσεις στον Περιφερειακό & Αττική Οδό.', en: 'Delays on Ring Roads & Attiki Odos.' }
      ]
    };
  }

  // Normal daytime
  return {
    multiplier: 1.15,
    delayFactorMinPer10Km: 2.5,
    level: 'moderate',
    description: {
      el: 'Κανονική αστική κυκλοφορία με μέτριες τοπικές επιβραδύνσεις.',
      en: 'Normal urban traffic flow with moderate localized slowdowns.'
    },
    incidents: [
      { el: 'Ομαλή πρόσβαση προς τις πύλες επειγόντων.', en: 'Normal access towards emergency hospital gates.' }
    ]
  };
}

/**
 * Fetch turnkey route using free OSRM API (Open Source Routing Machine)
 * Fallback to direct geometric route if network or rate limit occurs.
 */
export async function fetchOSRMRoute(
  startLat: number,
  startLng: number,
  destLat: number,
  destLng: number,
  hospitalName: string
): Promise<RouteInfo> {
  const traffic = getTrafficConditions();
  const url = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${destLng},${destLat}?overview=full&geometries=geojson&steps=true`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6500);

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`OSRM responded with status ${response.status}`);
    }

    const data = await response.json();

    if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
      const route = data.routes[0];
      const distanceKm = Math.round((route.distance / 1000) * 10) / 10;
      const baseDurationMin = Math.max(1, Math.round(route.duration / 60));

      // Calculate traffic-adjusted duration
      const trafficDelayMin = Math.round(
        (distanceKm / 10) * traffic.delayFactorMinPer10Km * (traffic.multiplier - 1) * 2
      );
      const durationWithTrafficMin = baseDurationMin + Math.max(0, trafficDelayMin);

      // GeoJSON returns [lng, lat], convert to Leaflet [lat, lng]
      const coordinates: [number, number][] = route.geometry.coordinates.map(
        (point: [number, number]) => [point[1], point[0]]
      );

      // Format turn-by-turn steps
      const steps: RouteStep[] = (route.legs[0]?.steps || []).map((step: any) => {
        let instruction = step.maneuver?.type || 'Οδηγήστε';
        if (step.name) {
          instruction += ` προς ${step.name}`;
        }
        return {
          instruction,
          distanceMeters: Math.round(step.distance),
          durationSec: Math.round(step.duration),
          type: step.maneuver?.modifier || step.maneuver?.type
        };
      });

      return {
        distanceKm,
        durationMin: baseDurationMin,
        durationWithTrafficMin,
        trafficDelayMin,
        trafficLevel: traffic.level,
        coordinates,
        steps,
        summary: `Ταχύτερη διαδρομή προς ${hospitalName} (${distanceKm} χλμ, ~${durationWithTrafficMin} λ.)`
      };
    }
  } catch (err) {
    console.warn('OSRM service call warning (falling back to generated route line):', err);
  }

  // Reliable offline fallback route calculation
  const fallbackDistanceKm = calculateHaversineDistance(startLat, startLng, destLat, destLng);
  // Estimate urban driving speed ~35 km/h in Greece
  const fallbackBaseMin = Math.max(2, Math.round((fallbackDistanceKm / 35) * 60));
  const fallbackDelayMin = Math.round((fallbackDistanceKm / 10) * traffic.delayFactorMinPer10Km);

  // Generate intermediate points along the path
  const numPoints = 12;
  const coordinates: [number, number][] = [];
  for (let i = 0; i <= numPoints; i++) {
    const ratio = i / numPoints;
    // slight curve for realism
    const bend = Math.sin(ratio * Math.PI) * 0.004;
    coordinates.push([
      startLat + (destLat - startLat) * ratio + bend,
      startLng + (destLng - startLng) * ratio + bend
    ]);
  }

  return {
    distanceKm: fallbackDistanceKm,
    durationMin: fallbackBaseMin,
    durationWithTrafficMin: fallbackBaseMin + fallbackDelayMin,
    trafficDelayMin: fallbackDelayMin,
    trafficLevel: traffic.level,
    coordinates,
    steps: [
      {
        instruction: `Αναχώρηση από την τρέχουσα τοποθεσία σας`,
        distanceMeters: Math.round(fallbackDistanceKm * 300),
        durationSec: Math.round(fallbackBaseMin * 20)
      },
      {
        instruction: `Συνεχίστε στην κεντρική αρτηρία προς ${hospitalName}`,
        distanceMeters: Math.round(fallbackDistanceKm * 600),
        durationSec: Math.round(fallbackBaseMin * 35)
      },
      {
        instruction: `Άφιξη στα Επείγοντα Περιστατικά (ΤΕΠ) - ${hospitalName}`,
        distanceMeters: 100,
        durationSec: 15
      }
    ],
    summary: `Άμεση διαδρομή προς ${hospitalName} (~${fallbackDistanceKm} χλμ)`
  };
}
