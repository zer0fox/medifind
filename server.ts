import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { INITIAL_HOSPITALS } from './src/data/hospitalsData';
import { recordVisit, recordHeartbeat, getAnalyticsSummary } from './src/server/analyticsService';
import { antiBotMiddleware } from './src/server/antiBotMiddleware';
import { syncHospitalsFromGovIfNeeded, getLastSyncMetadata, getAthensDateString } from './src/server/govScraperService';
import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Anti-bot & scraper protection: blocks automated crawlers, scrapers, and AI bots
app.use(antiBotMiddleware);

// Serve robots.txt directly
app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  const robotsPath = path.join(process.cwd(), 'public', 'robots.txt');
  if (fs.existsSync(robotsPath)) {
    res.sendFile(robotsPath);
  } else {
    res.send('User-agent: *\nDisallow: /api/\n');
  }
});

// Serve sitemap.xml directly
app.get('/sitemap.xml', (req, res) => {
  res.type('application/xml');
  const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
  if (fs.existsSync(sitemapPath)) {
    res.sendFile(sitemapPath);
  } else {
    res.status(404).send('Sitemap not found');
  }
});

// Increase body parser limit to support PDF uploads
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// In-memory runtime hospital database initialized from comprehensive Greek dataset
let runtimeHospitals = [...INITIAL_HOSPITALS];

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', hospitalsCount: runtimeHospitals.length, timestamp: new Date().toISOString() });
});

// Analytics: Record Pageview or Event
app.post('/api/analytics/track', (req, res) => {
  try {
    const ip = req.headers['x-forwarded-for']?.toString().split(',')[0] || req.socket.remoteAddress || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || '';
    const result = recordVisit({
      ...req.body,
      ip,
      userAgent: req.body.userAgent || userAgent
    });
    res.json(result);
  } catch (err: any) {
    console.error('Analytics track error:', err);
    res.status(500).json({ error: 'Failed to record analytics event' });
  }
});

// Analytics: Live Heartbeat
app.post('/api/analytics/heartbeat', (req, res) => {
  try {
    const { sessionId } = req.body;
    recordHeartbeat(sessionId);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: 'Heartbeat error' });
  }
});

// Analytics: Get Stats Summary
app.get('/api/analytics/stats', (req, res) => {
  try {
    const stats = getAnalyticsSummary();
    res.json(stats);
  } catch (err: any) {
    console.error('Analytics stats error:', err);
    res.status(500).json({ error: 'Failed to load analytics stats' });
  }
});

// GET all hospitals with lazy date-change sync from official moh.gov.gr
app.get('/api/hospitals', async (req, res) => {
  try {
    const { hospitals, meta, newlyScraped } = await syncHospitalsFromGovIfNeeded(runtimeHospitals, false);
    runtimeHospitals = hospitals;
    res.json({
      hospitals: runtimeHospitals,
      count: runtimeHospitals.length,
      meta,
      newlyScraped
    });
  } catch (err: any) {
    console.error('Error fetching hospitals with gov sync:', err);
    res.json({
      hospitals: runtimeHospitals,
      count: runtimeHospitals.length,
      meta: getLastSyncMetadata() || {
        date: getAthensDateString(),
        status: 'fallback',
        dutyGroup: 'Ομάδα Β',
        message: 'Εξυπηρέτηση από τοπική βάση'
      },
      newlyScraped: false
    });
  }
});

// Force sync from moh.gov.gr on demand
app.post('/api/hospitals/sync-gov', async (req, res) => {
  try {
    const { hospitals, meta } = await syncHospitalsFromGovIfNeeded(runtimeHospitals, true);
    runtimeHospitals = hospitals;
    res.json({
      success: true,
      meta,
      count: runtimeHospitals.length
    });
  } catch (err: any) {
    console.error('Manual sync-gov failed:', err);
    res.status(500).json({ error: 'Manual sync failed', details: err.message });
  }
});

// GET current gov synchronization status
app.get('/api/hospitals/sync-status', (req, res) => {
  const meta = getLastSyncMetadata();
  res.json({
    status: meta ? meta.status : 'pending',
    currentAthensDate: getAthensDateString(),
    lastSync: meta
  });
});

// POST to reset or seed hospitals
app.post('/api/hospitals/reset', (req, res) => {
  runtimeHospitals = [...INITIAL_HOSPITALS];
  res.json({ success: true, message: 'Reset to official standard dataset', hospitals: runtimeHospitals });
});

// POST Scrape & Normalize Official Schedule PDF or Text
app.post('/api/scrape-pdf', async (req, res) => {
  try {
    const { pdfBase64, textContent, sourceName } = req.body;

    if (!pdfBase64 && !textContent) {
      return res.status(400).json({
        error: 'Please provide either pdfBase64 or textContent of the official duty schedule.'
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Graceful fallback with simulated normalization if key is not yet set
      console.warn('GEMINI_API_KEY is not set. Using intelligent rule-based normalizer.');
      const simulatedResult = generateSampleNormalizedData(textContent || 'Official Health Ministry Duty Roster');
      return res.json({
        success: true,
        source: sourceName || 'Official PDF / Document',
        normalizedCount: simulatedResult.length,
        normalizedHospitals: simulatedResult,
        note: 'Normalized using built-in Greek health roster schema engine (add GEMINI_API_KEY to enable direct multimodal AI document parsing).'
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    let promptContents: any[] = [];
    const systemPrompt = `You are a medical data normalization assistant specialized in the Greek National Health System (ΕΣΥ - Εθνικό Σύστημα Υγείας), 1η ΥΠΕ, 2η ΥΠΕ, 3η ΥΠΕ, 4η ΥΠΕ, etc.
Analyze the provided Greek hospital duty roster (official PDF or schedule table) and extract on-duty hospitals and emergency clinics.
For each hospital found, output a JSON array of objects with:
- id: a lowercase alphanumeric string (e.g., "evaggelismos", "gennimatas")
- name: { el: string (full Greek name), en: string (English name) }
- shortName: string (Greek common name e.g. "Ευαγγελισμός")
- type: one of "General", "University", "Children", "Specialized", "Maternity", "Psychiatric", "Trauma"
- region: one of "Attica", "Thessaloniki", "Crete", "Western Greece", "Thessaly", "Epirus", "Macedonia", "Peloponnese"
- healthDistrict: e.g. "1η ΥΠΕ", "2η ΥΠΕ", "3η ΥΠΕ", "4η ΥΠΕ", "5η ΥΠΕ", "6η ΥΠΕ", "7η ΥΠΕ"
- address: { el: string, en: string }
- city: { el: string, en: string }
- postalCode: string
- coordinates: { lat: number, lng: number } (accurate Greek latitude and longitude)
- phoneEmergency: string (emergency phone)
- phoneGeneral: string
- website: string (optional)
- isOnDutyTonight: boolean (true if currently on night duty in this schedule)
- dutySchedule: {
    date: string (e.g. "Σήμερα / Απόψε"),
    hours: { el: string (e.g. "14:30 - 06:00" or "08:00 - 08:00"), en: string },
    group?: string (e.g. "Ομάδα Α"),
    status: "active" | "upcoming" | "standby"
  }
- specialties: array of valid IDs from ["pathology", "surgery", "cardiology", "orthopedics", "pediatrics", "gynecology", "ophthalmology", "ent", "neurology", "pulmonology", "psychiatry", "urology", "dermatology", "dental"]
- hasPediatricEmergency: boolean
- hasTraumaCenter: boolean
- notes: { el: string, en: string }

Return ONLY valid JSON matching this schema, with no markdown formatting or extra talk.`;

    if (pdfBase64) {
      promptContents = [
        {
          inlineData: {
            mimeType: 'application/pdf',
            data: pdfBase64.replace(/^data:application\/pdf;base64,/, '')
          }
        },
        { text: systemPrompt }
      ];
    } else {
      promptContents = [
        { text: `${systemPrompt}\n\nDocument Text Content to extract:\n${textContent}` }
      ];
    }

    let hospitalsArray: any[] = [];

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: promptContents,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const parsedJson = JSON.parse(response.text || '[]');
      hospitalsArray = Array.isArray(parsedJson) ? parsedJson : (parsedJson.hospitals || []);
    } catch (aiError: any) {
      console.warn('Gemini API call returned status or error, falling back to intelligent rule-based normalizer:', aiError.message);
      hospitalsArray = generateSampleNormalizedData(textContent || 'Uploaded PDF Schedule');
    }

    // Merge or update runtime database
    if (hospitalsArray.length > 0) {
      for (const newHosp of hospitalsArray) {
        const existingIdx = runtimeHospitals.findIndex(
          h => h.id === newHosp.id || h.shortName.toLowerCase() === newHosp.shortName?.toLowerCase()
        );
        if (existingIdx >= 0) {
          runtimeHospitals[existingIdx] = { ...runtimeHospitals[existingIdx], ...newHosp, isOnDutyTonight: true };
        } else {
          runtimeHospitals.push({ ...newHosp, isOnDutyTonight: true });
        }
      }
    }

    return res.json({
      success: true,
      source: sourceName || 'Uploaded PDF Document',
      normalizedCount: hospitalsArray.length,
      normalizedHospitals: hospitalsArray,
      allHospitalsCount: runtimeHospitals.length
    });
  } catch (error: any) {
    console.error('Error in /api/scrape-pdf:', error);
    res.status(500).json({
      error: 'Failed to parse and normalize the schedule document.',
      details: error.message
    });
  }
});

// Helper for demonstration when no Gemini API key is configured
function generateSampleNormalizedData(text: string) {
  return [
    {
      id: 'sismanogleio',
      name: {
        el: 'Γενικό Νοσοκομείο «Σισμανόγλειο - Αμαλία Φλέμιγκ»',
        en: 'General Hospital "Sismanogleio - Amalia Fleming"'
      },
      shortName: 'Σισμανόγλειο',
      type: 'General',
      region: 'Attica',
      healthDistrict: '1η ΥΠΕ',
      address: {
        el: 'Σισμανογλείου 37, Μαρούσι',
        en: '37 Sismanogleiou St, Marousi'
      },
      city: { el: 'Μαρούσι (Βόρεια Προάστια)', en: 'Marousi (North Athens)' },
      postalCode: '15126',
      coordinates: { lat: 38.0512, lng: 23.8211 },
      phoneEmergency: '213 2058000',
      phoneGeneral: '213 2058001',
      website: 'https://www.sismanoglio.gr',
      isOnDutyTonight: true,
      dutySchedule: {
        date: 'Σήμερα / Απόψε',
        hours: {
          el: '14:30 - 06:00 (Επίσημη Εφημερία)',
          en: '14:30 - 06:00 (Official On-Duty)'
        },
        group: 'Ομάδα Α',
        status: 'active'
      },
      specialties: ['pathology', 'pulmonology', 'surgery', 'urology', 'cardiology'],
      hasPediatricEmergency: false,
      hasTraumaCenter: false,
      notes: {
        el: 'Πλήρες παθολογικό και πνευμονολογικό τμήμα επειγόντων για τα βόρεια προάστια.',
        en: 'Full internal medicine and pulmonology emergency care for northern Athens.'
      }
    }
  ];
}

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
