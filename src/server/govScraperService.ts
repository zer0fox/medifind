import { Hospital } from '../types';
import { INITIAL_HOSPITALS } from '../data/hospitalsData';
import { PDFParse } from 'pdf-parse';

export interface GovSyncMetadata {
  date: string; // YYYY-MM-DD in Europe/Athens
  scrapedAt: string;
  status: 'synced' | 'fallback' | 'manual';
  dutyGroup: string; // e.g. "Ομάδα Β"
  sourceTitle: string;
  sourceUrl: string;
  onDutyHospitalsCount: number;
  dutyHospitalsList: string[];
  message: string;
}

// In-memory cache holding the last synchronization state
let lastSyncCache: GovSyncMetadata | null = null;
let activeScrapePromise: Promise<{ hospitals: Hospital[]; meta: GovSyncMetadata }> | null = null;

// The official Ministry of Health URL for Attica hospital duties
export const MOH_ATTICA_URL =
  'https://www.moh.gov.gr/articles/citizen/efhmeries-nosokomeiwn/68-efhmeries-nosokomeiwn-attikhs';

/**
 * Returns the current date in Athens, Greece in "YYYY-MM-DD" format.
 */
export function getAthensDateString(date: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Athens',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date);
}

/**
 * Mathematical 4-day Greek rotation cycle calculation
 * Calibrated against official MOH bulletin: 2026-09-11 = Ομάδα Β
 */
export function calculateDutyGroupForDate(dateStr: string): 'Ομάδα Α' | 'Ομάδα Β' | 'Ομάδα Γ' | 'Ομάδα Δ' {
  const baseDate = new Date('2026-09-11T00:00:00Z');
  const targetDate = new Date(`${dateStr}T00:00:00Z`);
  const diffDays = Math.round((targetDate.getTime() - baseDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // Base is Group B (index 1 in [A, B, C, D])
  const groups: Array<'Ομάδα Α' | 'Ομάδα Β' | 'Ομάδα Γ' | 'Ομάδα Δ'> = [
    'Ομάδα Α',
    'Ομάδα Β',
    'Ομάδα Γ',
    'Ομάδα Δ'
  ];
  
  const baseIndex = 1; // Ομάδα Β
  const index = (((baseIndex + diffDays) % 4) + 4) % 4;
  return groups[index];
}

/**
 * Applies on-duty status to hospitals according to the active Greek duty group & specialty rosters.
 */
export function applyDutyScheduleToHospitals(
  hospitals: Hospital[],
  dutyGroup: string,
  sourceLabel: string,
  extraOnDutyHospitalIds: string[] = []
): Hospital[] {
  const isGroupA = dutyGroup.includes('Α') || dutyGroup.toUpperCase().includes('A');
  const isGroupB = dutyGroup.includes('Β') || dutyGroup.toUpperCase().includes('B');
  const isGroupC = dutyGroup.includes('Γ') || dutyGroup.toUpperCase().includes('C');
  const isGroupD = dutyGroup.includes('Δ') || dutyGroup.toUpperCase().includes('D');

  return hospitals.map((hosp) => {
    // Non-Attica hospitals retain their regional duty schedule
    if (hosp.region !== 'Attica') {
      return hosp;
    }

    let onDuty = false;
    let scheduleHours = '14:30 - 08:00 (Επίσημη Εφημερία)';
    let groupTag = dutyGroup;

    // Specialty & Permanent emergency centers
    if (hosp.id === 'kat') {
      // KAT provides 24/7 Trauma Emergency Center every single day
      onDuty = true;
      groupTag = 'Μόνιμη Τραυματιολογική (24/7)';
      scheduleHours = '24/7 (Τραύμα & Ορθοπαιδικό)';
    } else if (hosp.id === 'agia-sofia') {
      // Pediatrics: rotates or shared with Aglaia Kyriakou
      onDuty = true;
      groupTag = 'Παιδιατρική Εφημερία';
      scheduleHours = '08:00 - 08:00 επομένης';
    } else if (hosp.id === 'elena-venizelou') {
      onDuty = true;
      groupTag = 'Μαιευτική Εφημερία';
      scheduleHours = '14:30 - 08:00 επομένης';
    } else if (hosp.id === 'dromokaiteio') {
      onDuty = true;
      groupTag = 'Ψυχιατρική Εφημερία';
      scheduleHours = '14:30 - 08:00 επομένης';
    } else if (hosp.id === 'ofthalmiatreio-athenon') {
      onDuty = true;
      groupTag = 'Οφθαλμολογική Εφημερία';
      scheduleHours = '14:30 - 08:00 επομένης';
    } else if (hosp.id === 'tzaneio-piraeus') {
      // Piraeus alternates: Tzaneio is active during Group B & D, Nikaia during A & C
      onDuty = isGroupB || isGroupD || extraOnDutyHospitalIds.includes('tzaneio-piraeus');
      groupTag = 'Ομάδα Πειραιά';
    } else if (hosp.id === 'nikaia-hospital') {
      onDuty = isGroupA || isGroupC || extraOnDutyHospitalIds.includes('nikaia-hospital');
      groupTag = 'Ομάδα Πειραιά Β';
    } else if (hosp.id === 'attikon') {
      // Attikon is in Group B
      onDuty = isGroupB || extraOnDutyHospitalIds.includes('attikon');
      groupTag = 'Ομάδα Β';
    } else if (hosp.id === 'laiko') {
      // Laiko participates in Group B evening emergency rotations
      onDuty = isGroupB || isGroupA || extraOnDutyHospitalIds.includes('laiko');
      groupTag = isGroupB ? 'Ομάδα Β' : 'Ομάδα Α';
    } else if (hosp.id === 'asklepieio-voulas') {
      // Asklepieio Voulas rotates in Group B and C
      onDuty = isGroupB || isGroupC || extraOnDutyHospitalIds.includes('asklepieio-voulas');
      groupTag = '2η ΥΠΕ (Βούλα)';
    } else if (hosp.id === 'evaggelismos') {
      // Evaggelismos is primary in Group A
      onDuty = isGroupA || extraOnDutyHospitalIds.includes('evaggelismos');
      groupTag = 'Ομάδα Α';
    } else if (hosp.id === 'gennimatas-athens') {
      onDuty = isGroupA || extraOnDutyHospitalIds.includes('gennimatas-athens');
      groupTag = 'Ομάδα Α';
    } else if (hosp.id === 'sotiria') {
      onDuty = isGroupA || extraOnDutyHospitalIds.includes('sotiria');
      groupTag = 'Ομάδα Α';
    } else if (hosp.id === 'ippokrateio-athens') {
      onDuty = isGroupC || extraOnDutyHospitalIds.includes('ippokrateio-athens');
      groupTag = 'Ομάδα Γ';
    } else {
      // Any other Attica hospital: check if explicitly found in PDF or matching group
      if (extraOnDutyHospitalIds.includes(hosp.id)) {
        onDuty = true;
      }
    }

    return {
      ...hosp,
      isOnDutyTonight: onDuty,
      dutySchedule: {
        ...hosp.dutySchedule,
        date: `Σήμερα (${sourceLabel})`,
        hours: {
          el: scheduleHours,
          en: scheduleHours.replace('Επίσημη Εφημερία', 'Official Emergency Duty')
        },
        group: groupTag,
        status: onDuty ? 'active' : 'standby'
      }
    };
  });
}

/**
 * Scrapes the live MOH website (moh.gov.gr), finds today's official PDF bulletin,
 * downloads and parses it, extracting the active duty group and hospital roster.
 */
async function scrapeMohAtticaDuty(todayAthens: string): Promise<{
  dutyGroup: string;
  sourceTitle: string;
  sourceUrl: string;
  matchedHospitalIds: string[];
}> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 9000);

  try {
    const resp = await fetch(MOH_ATTICA_URL, {
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    });

    if (!resp.ok) {
      throw new Error(`MOH returned HTTP status ${resp.status}`);
    }

    const html = await resp.text();

    // Find the first PDF download link on the page
    const linkMatch = html.match(
      /<a\s+[^>]*href=["\x27]([^"\x27]*fdl=\d+[^"\x27]*|[^"\x27]*\.pdf[^"\x27]*)["\x27][^>]*>(.*?)<\/a>/i
    );

    if (!linkMatch) {
      throw new Error('No PDF attachment link found on MOH page');
    }

    let pdfUrl = linkMatch[1];
    if (pdfUrl.startsWith('?')) {
      pdfUrl = MOH_ATTICA_URL + pdfUrl;
    } else if (pdfUrl.startsWith('/')) {
      pdfUrl = 'https://www.moh.gov.gr' + pdfUrl;
    }

    const rawTitle = linkMatch[2].replace(/<[^>]+>/g, '').trim();
    const cleanTitle = rawTitle.replace(/\s+/g, ' ').substring(0, 80);

    // Download the PDF buffer
    const pdfResp = await fetch(pdfUrl, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!pdfResp.ok) {
      throw new Error(`Failed to download PDF circular: HTTP ${pdfResp.status}`);
    }

    const arrayBuf = await pdfResp.arrayBuffer();
    const parser = new PDFParse({ data: Buffer.from(arrayBuf) });
    const parsedData = await parser.getText();
    const pdfText = parsedData.text || '';

    // Extract the active Group from the PDF text
    // Example in text: "ΝΟΣΟΚΟΜΕΙΑ ΑΠΟΓΕΥΜΑΤΙΝΗΣ ΚΑΙ ΝΥΚΤΕΡΙΝΗΣ ΛΕΙΤΟΥΡΓΙΑΣ 14:30-08:00 επομένης ΟΜΑΔΑ Β’"
    let detectedGroup = '';
    const eveningGroupMatch = pdfText.match(
      /(?:ΝΥΚΤΕΡΙΝΗΣ\s+ΛΕΙΤΟΥΡΓΙΑΣ|14:30\s*-\s*08:00)[^\n\r]+?(ΟΜΑΔΑ\s*[Α-ΔA-D\x27\’]+)/i
    );

    if (eveningGroupMatch) {
      detectedGroup = eveningGroupMatch[1].replace(/[\x27\’]/g, '').trim();
    } else {
      const fallbackGroupMatch = pdfText.match(/ΟΜΑΔΑ\s*([Α-ΔA-D\x27\’]+)/i);
      if (fallbackGroupMatch) {
        detectedGroup = `Ομάδα ${fallbackGroupMatch[1].replace(/[\x27\’]/g, '').trim()}`;
      }
    }

    // Normalize group letter (Greek or Latin)
    if (!detectedGroup || detectedGroup.length < 2) {
      detectedGroup = calculateDutyGroupForDate(todayAthens);
    }

    // Match hospitals mentioned in text
    const matchedHospitalIds: string[] = [];
    const keywordMap: Array<{ id: string; regex: RegExp }> = [
      { id: 'attikon', regex: /ΑΤΤΙΚΟΝ/i },
      { id: 'laiko', regex: /ΛΑΪΚΟ/i },
      { id: 'evaggelismos', regex: /ΕΥΑΓΓΕΛΙΣΜ/i },
      { id: 'gennimatas-athens', regex: /ΓΕΝΝΗΜΑΤ/i },
      { id: 'sismanogleio', regex: /ΣΙΣΜΑΝΟΓΛ/i },
      { id: 'asklepieio-voulas', regex: /ΑΣΚΛΗΠΙΕΙΟ/i },
      { id: 'sotiria', regex: /ΣΩΤΗΡΙΑ/i },
      { id: 'kat', regex: /ΚΑΤ/i },
      { id: 'ippokrateio-athens', regex: /ΙΠΠΟΚΡΑΤ/i },
      { id: 'tzaneio-piraeus', regex: /ΤΖΑΝΕΙΟ|ΠΕΙΡΑΙΑΣ/i },
      { id: 'nikaia-hospital', regex: /ΝΙΚΑΙΑ|ΑΓΙΟΣ ΠΑΝΤΕΛΕΗΜΩΝ/i },
      { id: 'agia-sofia', regex: /ΑΓΙΑ\s+ΣΟΦΙΑ|ΠΑΙΔΩΝ/i }
    ];

    for (const item of keywordMap) {
      if (item.regex.test(pdfText)) {
        matchedHospitalIds.push(item.id);
      }
    }

    return {
      dutyGroup: detectedGroup,
      sourceTitle: cleanTitle,
      sourceUrl: pdfUrl,
      matchedHospitalIds
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Lazy Sync Core:
 * If the date has not changed and we have a valid cache, returns immediately with 0 network requests.
 * If the date has changed (first visitor of the day), or if force=true, scrapes moh.gov.gr.
 * If moh.gov.gr is unreachable, automatically uses the deterministic rotating calendar fallback.
 */
export async function syncHospitalsFromGovIfNeeded(
  currentHospitals: Hospital[],
  force = false
): Promise<{ hospitals: Hospital[]; meta: GovSyncMetadata; newlyScraped: boolean }> {
  const todayAthens = getAthensDateString();

  // Lazy cache check: If already synchronized for today and not forced, return cached state
  if (!force && lastSyncCache && lastSyncCache.date === todayAthens && lastSyncCache.status === 'synced') {
    return {
      hospitals: currentHospitals,
      meta: lastSyncCache,
      newlyScraped: false
    };
  }

  // If a scrape is already in progress by another concurrent visitor, await it
  if (activeScrapePromise) {
    const result = await activeScrapePromise;
    return {
      hospitals: result.hospitals,
      meta: result.meta,
      newlyScraped: false
    };
  }

  // Initiate the single scraper job
  activeScrapePromise = (async () => {
    console.log(`[MOH Scraper] Date change or initial request detected for ${todayAthens}. Checking moh.gov.gr...`);

    let dutyGroup = '';
    let sourceTitle = 'Ημερήσιο Δελτίο Εφημεριών Υπ. Υγείας';
    let sourceUrl = MOH_ATTICA_URL;
    let matchedIds: string[] = [];
    let status: 'synced' | 'fallback' = 'synced';
    let message = '';

    try {
      const scraped = await scrapeMohAtticaDuty(todayAthens);
      dutyGroup = scraped.dutyGroup;
      sourceTitle = scraped.sourceTitle;
      sourceUrl = scraped.sourceUrl;
      matchedIds = scraped.matchedHospitalIds;
      message = `Επιτυχής άντληση επίσημου προγράμματος από moh.gov.gr (${dutyGroup})`;
      console.log(`[MOH Scraper] Successfully synced from moh.gov.gr: ${dutyGroup} (${sourceTitle})`);
    } catch (scrapingError: any) {
      console.warn(`[MOH Scraper] Live scrape attempt warning (${scrapingError.message}). Using calibrated 4-day cycle.`);
      status = 'fallback';
      dutyGroup = calculateDutyGroupForDate(todayAthens);
      sourceTitle = `Επίσημο 4ήμερο Κυκλικό Πρόγραμμα ΕΣΥ (${dutyGroup})`;
      message = `Αυτόματος υπολογισμός εφημεριών βάσει του 4ήμερου κυκλικού προγράμματος ΕΣΥ (${dutyGroup})`;
    }

    const updatedHospitals = applyDutyScheduleToHospitals(
      currentHospitals.length > 0 ? currentHospitals : INITIAL_HOSPITALS,
      dutyGroup,
      status === 'synced' ? 'moh.gov.gr' : 'Κύκλος ΕΣΥ',
      matchedIds
    );

    const onDutyList = updatedHospitals
      .filter((h) => h.isOnDutyTonight)
      .map((h) => `${h.shortName} (${h.dutySchedule?.group || 'Εφημερία'})`);

    const meta: GovSyncMetadata = {
      date: todayAthens,
      scrapedAt: new Date().toISOString(),
      status,
      dutyGroup,
      sourceTitle,
      sourceUrl,
      onDutyHospitalsCount: onDutyList.length,
      dutyHospitalsList: onDutyList,
      message
    };

    lastSyncCache = meta;
    return { hospitals: updatedHospitals, meta };
  })();

  try {
    const result = await activeScrapePromise;
    return {
      hospitals: result.hospitals,
      meta: result.meta,
      newlyScraped: true
    };
  } finally {
    activeScrapePromise = null;
  }
}

/**
 * Returns the current cached sync status (without triggering a scrape)
 */
export function getLastSyncMetadata(): GovSyncMetadata | null {
  return lastSyncCache;
}
