/**
 * Client-side Traffic & Analytics Tracker
 * 100% Free & Privacy-Friendly (Self-Hosted + Optional GoatCounter / GA4)
 */

function getSessionId(): string {
  if (typeof window === 'undefined') return 'server-session';
  let sid = sessionStorage.getItem('medifind_analytics_sid');
  if (!sid) {
    sid = 'mf_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now().toString(36);
    sessionStorage.setItem('medifind_analytics_sid', sid);
  }
  return sid;
}

export function initAnalytics() {
  if (typeof window === 'undefined') return;

  const sessionId = getSessionId();

  // 1. Send initial self-hosted pageview tracking
  try {
    const payload = {
      path: window.location.pathname + window.location.search,
      referrer: document.referrer || 'direct',
      screenWidth: window.innerWidth,
      sessionId
    };

    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true
    }).catch(() => {
      // silently ignore if offline
    });
  } catch (err) {
    console.debug('Analytics ping skipped:', err);
  }

  // 2. Start heartbeat every 45 seconds to keep active visitors fresh
  const heartbeatInterval = setInterval(() => {
    if (document.visibilityState === 'visible') {
      fetch('/api/analytics/heartbeat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
        keepalive: true
      }).catch(() => {});
    }
  }, 45000);

  // 3. Optional: Inject GoatCounter if configured (100% free open-source privacy analytics)
  const goatCounterCode = (import.meta as any).env?.VITE_GOATCOUNTER_CODE;
  if (goatCounterCode && !document.getElementById('goatcounter-script')) {
    const script = document.createElement('script');
    script.id = 'goatcounter-script';
    script.dataset.goatcounter = `https://${goatCounterCode}.goatcounter.com/count`;
    script.async = true;
    script.src = '//gc.zgo.at/count.js';
    document.head.appendChild(script);
  }

  // 4. Optional: Inject Google Analytics 4 if configured
  const gaId = (import.meta as any).env?.VITE_GA_MEASUREMENT_ID;
  if (gaId && !document.getElementById('ga-gtag-script')) {
    const script = document.createElement('script');
    script.id = 'ga-gtag-script';
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    document.head.appendChild(script);

    const inlineScript = document.createElement('script');
    inlineScript.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${gaId}', { anonymize_ip: true });
    `;
    document.head.appendChild(inlineScript);
  }

  return () => {
    clearInterval(heartbeatInterval);
  };
}

export function trackEvent(eventName: string, eventData?: Record<string, any>) {
  if (typeof window === 'undefined') return;
  const sessionId = getSessionId();

  try {
    const payload = {
      eventName,
      eventData,
      sessionId,
      path: window.location.pathname
    };

    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true
    }).catch(() => {});

    // Also trigger GA event if present
    if ((window as any).gtag) {
      (window as any).gtag('event', eventName, eventData);
    }
  } catch (err) {
    console.debug('Event tracking error:', err);
  }
}

export async function fetchAnalyticsStats() {
  try {
    const res = await fetch('/api/analytics/stats');
    if (!res.ok) throw new Error('Failed to fetch analytics');
    return await res.json();
  } catch (err) {
    console.error('Fetch analytics stats error:', err);
    return null;
  }
}
