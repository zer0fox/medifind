import { Request, Response, NextFunction } from 'express';

// Legitimate search engines explicitly permitted to crawl and index MediFind
const ALLOWED_SEARCH_ENGINES: RegExp[] = [
  /googlebot/i,
  /bingbot/i,
  /applebot/i,
  /duckduckbot/i,
  /yandexbot/i,
  /slurp/i,          // Yahoo Search
  /baiduspider/i,
  /sogou/i,
  /exabot/i,
  /qwantify/i
];

// Blocked AI harvesters, dataset collectors, commercial scrapers & automation scripts
const BLOCKED_SCRAPERS_AND_AI_BOTS: RegExp[] = [
  // AI & LLM Harvesters
  /gptbot/i,
  /chatgpt-user/i,
  /google-extended/i,
  /anthropic-ai/i,
  /claudebot/i,
  /bytespider/i,
  /ccbot/i,
  /diffbot/i,
  /cohere-ai/i,
  /perplexitybot/i,
  /omgilibot/i,
  /omgili/i,
  /youbot/i,
  /imagesiftbot/i,
  /amazonbot/i,
  /facebookbot/i,
  /meta-externalagent/i,
  /applebot-extended/i,
  /timpibot/i,
  /velenpublicwebcrawler/i,
  /webzio/i,

  // Social scrapers & Archivers
  /facebot/i,
  /twitterbot/i,
  /linkedinbot/i,
  /pinterestbot/i,
  /ia_archiver/i,

  // Commercial SEO & Data Extractors
  /ahrefsbot/i,
  /semrushbot/i,
  /dotbot/i,
  /mj12bot/i,
  /rogerbot/i,
  /megaindex/i,
  /blexbot/i,
  /zoominfobot/i,
  /screaming frog/i,
  /sitebulb/i,
  /datanyze/i,
  /censys/i,
  /shodan/i,
  /netcraft/i,
  /dataforseobot/i,

  // Automated Script Engines & Scraping Libraries
  /scrapy/i,
  /python-requests/i,
  /python-urllib/i,
  /aiohttp/i,
  /httpx/i,
  /beautifulsoup/i,
  /selenium/i,
  /puppeteer/i,
  /playwright/i,
  /phantomjs/i,
  /headlesschrome/i,
  /casperjs/i,
  /node-fetch/i,
  /axios/i,
  /go-http-client/i,
  /apache-httpclient/i,
  /libwww-perl/i,
  /curl\//i,
  /wget\//i,
  /httpclient/i,
  /winhttp/i
];

// In-memory sliding window rate limiter to throttle rapid data harvesting
interface RateLimitRecord {
  count: number;
  resetAt: number;
}
const ipRateLimits = new Map<string, RateLimitRecord>();

// Clean up stale rate limits every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, rec] of ipRateLimits.entries()) {
    if (rec.resetAt < now) {
      ipRateLimits.delete(ip);
    }
  }
}, 300000);

/**
 * Middleware to strictly allow search engines to crawl and index the site,
 * while blocking automated bots, scrapers, and AI harvesters.
 */
export function antiBotMiddleware(req: Request, res: Response, next: NextFunction) {
  const userAgent = req.headers['user-agent'] || '';
  const clientIp = req.headers['x-forwarded-for']?.toString().split(',')[0].trim() || req.socket.remoteAddress || '';
  const isLocalhost = clientIp === '127.0.0.1' || clientIp === '::1' || clientIp === '::ffff:127.0.0.1';

  // 1. Allow local container health check bypass
  if (req.path === '/api/health' && isLocalhost) {
    return next();
  }

  // 2. Check if the requester is an explicitly allowed major search engine
  const isAllowedSearchEngine = ALLOWED_SEARCH_ENGINES.some((pattern) => pattern.test(userAgent));

  if (isAllowedSearchEngine) {
    // Allow search engines to crawl and index website pages
    if (req.path.startsWith('/api/')) {
      // Don't index raw backend API endpoints, but allow fetch if needed
      res.setHeader('X-Robots-Tag', 'noindex');
    } else {
      res.setHeader('X-Robots-Tag', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
    }
    return next();
  }

  // 3. Block missing or empty user-agents (standard browsers & search engines always provide one)
  if (!userAgent || userAgent.trim().length < 5) {
    res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive');
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Access denied: Missing or invalid User-Agent. Automated scraping is strictly prohibited.',
      status: 403
    });
  }

  // 4. Check against known AI scrapers, dataset harvesters, and automation bots
  const isBlockedScraper = BLOCKED_SCRAPERS_AND_AI_BOTS.some((pattern) => pattern.test(userAgent));

  if (isBlockedScraper) {
    // Local dev health check exception
    if (isLocalhost && req.path === '/api/health') {
      return next();
    }

    res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');
    console.warn(`[AntiBot] Blocked scraper/harvester: "${userAgent}" from IP: ${clientIp} on path: ${req.path}`);

    // Return 403 Forbidden
    if (req.accepts('html') && !req.path.startsWith('/api/')) {
      return res.status(403).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="robots" content="noindex, nofollow, noarchive, nosnippet">
          <title>403 - Access Denied</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; padding: 20px; box-sizing: border-box; }
            .card { background: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 32px; max-width: 480px; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
            h1 { font-size: 20px; margin-bottom: 8px; color: #ef4444; }
            p { font-size: 14px; color: #94a3b8; line-height: 1.6; }
            .badge { display: inline-block; padding: 4px 10px; background: rgba(239, 68, 68, 0.15); color: #f87171; border-radius: 9999px; font-size: 12px; font-weight: 600; margin-bottom: 16px; }
          </style>
        </head>
        <body>
          <div class="card">
            <span class="badge">Shield Active</span>
            <h1>Access Denied / Απαγόρευση Πρόσβασης</h1>
            <p>Automated scrapers, AI harvesters, and unauthorized bots are strictly prohibited from indexing or extracting data from MediFind.</p>
            <p style="margin-top: 16px; font-size: 12px; color: #64748b;">Legitimate search engines and real users have full access.</p>
          </div>
        </body>
        </html>
      `);
    }

    return res.status(403).json({
      error: 'Forbidden',
      message: 'Access denied: Automated crawlers, AI harvesters, and scrapers are strictly prohibited.',
      status: 403
    });
  }

  // 5. Rate limiter for API endpoints (protects against scraping attempts by spoofed user-agents)
  if (req.path.startsWith('/api/') && !isLocalhost) {
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute
    const maxRequests = 100; // max 100 requests / minute per IP

    let record = ipRateLimits.get(clientIp);
    if (!record || record.resetAt < now) {
      record = { count: 1, resetAt: now + windowMs };
      ipRateLimits.set(clientIp, record);
    } else {
      record.count += 1;
      if (record.count > maxRequests) {
        return res.status(429).json({
          error: 'Too Many Requests',
          message: 'Rate limit exceeded. Automated scraping and data extraction are prohibited.',
          retryAfter: Math.ceil((record.resetAt - now) / 1000)
        });
      }
    }
  }

  // Allow standard browser visits
  res.setHeader('X-Robots-Tag', 'index, follow');
  next();
}
