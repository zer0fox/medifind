/**
 * Map navigation utilities for launching external native map applications
 * (Apple Maps on iOS/macOS, Google Maps on Android/desktop, or system geo: intent).
 */

export interface MapLinks {
  defaultDeviceUrl: string;
  defaultDeviceName: string;
  googleMapsUrl: string;
  appleMapsUrl: string;
  wazeUrl: string;
  geoUri: string;
}

export function isAppleDevice(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || navigator.vendor || '';
  const isApplePlatform = /iPad|iPhone|iPod|Macintosh/.test(ua);
  // Exclude Android devices that might fake userAgent
  const isAndroid = /Android/.test(ua);
  return isApplePlatform && !isAndroid;
}

export function isAndroidDevice(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
  return /Android/i.test(navigator.userAgent);
}

export function getHospitalMapLinks(
  lat: number, 
  lng: number, 
  name: string
): MapLinks {
  const encodedName = encodeURIComponent(name);
  
  // Apple Maps URL: directly triggers native Apple Maps app on iOS/iPadOS/macOS
  const appleMapsUrl = `https://maps.apple.com/?daddr=${lat},${lng}&q=${encodedName}&dirflg=d`;
  
  // Google Maps Universal URL: directly triggers Google Maps app or web
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=&travelmode=driving`;
  
  // Waze navigation
  const wazeUrl = `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`;
  
  // Android geo: intent (opens default navigation app chosen by user on Android)
  const geoUri = `geo:${lat},${lng}?q=${lat},${lng}(${encodedName})`;

  const isApple = isAppleDevice();
  const isAndroid = isAndroidDevice();

  let defaultDeviceUrl = googleMapsUrl;
  let defaultDeviceName = 'Google Maps';

  if (isApple) {
    defaultDeviceUrl = appleMapsUrl;
    defaultDeviceName = 'Apple Maps';
  } else if (isAndroid) {
    // Android default intent or Google Maps
    defaultDeviceUrl = googleMapsUrl;
    defaultDeviceName = 'Default Device Maps';
  }

  return {
    defaultDeviceUrl,
    defaultDeviceName,
    googleMapsUrl,
    appleMapsUrl,
    wazeUrl,
    geoUri
  };
}
