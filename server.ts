import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { INITIAL_EMPLOYEES, INITIAL_WEBSITES, INITIAL_MEDIA, INITIAL_ANNOUNCEMENTS } from './src/data/initialData';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // Anti-Hacking & Security Middleware
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    next();
  });

  app.use(express.json({ limit: '50mb' }));

  // Helper function to sanitize any string against XSS and script injections
  function sanitizeInput(str: any): string {
    if (typeof str !== 'string') return '';
    // Allow data URLs for uploaded photos and videos without corrupting base64 characters
    if (str.startsWith('data:image/') || str.startsWith('data:video/')) {
      return str;
    }
    return str
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/data:text\/html/gi, '')
      .trim();
  }

  function sanitizeObject(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.slice(0, 500).map(sanitizeObject);
    }
    if (obj !== null && typeof obj === 'object') {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'string') {
          sanitized[key] = sanitizeInput(value);
        } else if (typeof value === 'number' || typeof value === 'boolean') {
          sanitized[key] = value;
        } else if (typeof value === 'object') {
          sanitized[key] = sanitizeObject(value);
        }
      }
      return sanitized;
    }
    return obj;
  }

  // ==========================================
  // REAL-TIME MULTI-DEVICE SYNC ENGINE
  // ==========================================
  const dataDir = path.join(__dirname, 'server_data');
  const dataFilePath = path.join(dataDir, 'company_data.json');

  let companyData: {
    employees: any[];
    websites: any[];
    media: any[];
    announcements: any[];
    reports: any[];
    adminPassword?: string;
    privateWebsitesPassword?: string;
    updatedAt: number;
  };

  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    if (fs.existsSync(dataFilePath)) {
      const raw = fs.readFileSync(dataFilePath, 'utf-8');
      companyData = JSON.parse(raw);
      if (companyData.updatedAt === 1790859800000) {
        companyData.updatedAt = 0;
      }
      if (!Array.isArray(companyData.reports)) {
        companyData.reports = [];
      }
    } else {
      companyData = {
        employees: INITIAL_EMPLOYEES,
        websites: INITIAL_WEBSITES,
        media: INITIAL_MEDIA,
        announcements: INITIAL_ANNOUNCEMENTS,
        reports: [],
        updatedAt: 0,
      };
      fs.writeFileSync(dataFilePath, JSON.stringify(companyData, null, 2), 'utf-8');
    }
  } catch (err) {
    companyData = {
      employees: INITIAL_EMPLOYEES,
      websites: INITIAL_WEBSITES,
      media: INITIAL_MEDIA,
      announcements: INITIAL_ANNOUNCEMENTS,
      reports: [],
      updatedAt: 0,
    };
  }

  // CORS & No-Cache headers for all /api/sync routes
  app.use('/api/sync', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Cache-Control');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // Active SSE clients for instant broadcast to all mobiles & devices
  const sseClients = new Set<express.Response>();

  function broadcastUpdate() {
    const payload = `data: ${JSON.stringify(companyData)}\n\n`;
    for (const client of sseClients) {
      try {
        client.write(payload);
      } catch (err) {
        sseClients.delete(client);
      }
    }
  }

  // Public static assets & SEO files
  const publicDir = path.join(__dirname, 'public');
  app.use(express.static(publicDir));

  app.get('/favicon.ico', (req, res) => {
    res.setHeader('Content-Type', 'image/svg+xml');
    res.sendFile(path.join(publicDir, 'favicon.svg'));
  });

  app.get('/favicon.svg', (req, res) => {
    res.setHeader('Content-Type', 'image/svg+xml');
    res.sendFile(path.join(publicDir, 'favicon.svg'));
  });

  app.get('/manifest.json', (req, res) => {
    res.setHeader('Content-Type', 'application/manifest+json');
    res.sendFile(path.join(publicDir, 'manifest.json'));
  });

  app.get('/robots.txt', (req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.sendFile(path.join(publicDir, 'robots.txt'));
  });

  app.get('/sitemap.xml', (req, res) => {
    res.setHeader('Content-Type', 'application/xml');
    res.sendFile(path.join(publicDir, 'sitemap.xml'));
  });

  // GET /api/sync/stream - Server-Sent Events stream for instant real-time sync across all devices
  app.get('/api/sync/stream', (req, res) => {
    const userAgent = String(req.headers['user-agent'] || '');
    const isBot = /bot|googlebot|crawler|spider|inspectiontool|headlesschrome|lighthouse/i.test(userAgent);

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders();

    // Send immediate current data on connect
    res.write(`data: ${JSON.stringify(companyData)}\n\n`);

    // If crawler or Googlebot, finish immediately with 200 OK so Googlebot never times out
    if (isBot) {
      return res.end();
    }

    sseClients.add(res);

    // Keepalive heartbeat every 20 seconds to prevent mobile connection drops
    const keepAlive = setInterval(() => {
      res.write(': keepalive\n\n');
    }, 20000);

    req.on('close', () => {
      clearInterval(keepAlive);
      sseClients.delete(res);
    });
  });

  // GET /api/sync/version - Ultra lightweight (25 bytes) check for mobile live sync
  app.get('/api/sync/version', (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.json({ updatedAt: companyData.updatedAt });
  });

  // GET /api/sync/data - Fetch latest data
  app.get('/api/sync/data', (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.json(companyData);
  });

  // POST /api/sync/update - Push updates from any mobile/device with sanitization & security checks
  app.post('/api/sync/update', (req, res) => {
    try {
      const { employees, websites, media, announcements, adminPassword, privateWebsitesPassword } = req.body;
      if (Array.isArray(employees)) {
        companyData.employees = sanitizeObject(employees.slice(0, 500));
      }
      if (Array.isArray(websites)) {
        companyData.websites = sanitizeObject(websites.slice(0, 200));
      }
      if (Array.isArray(media)) {
        companyData.media = sanitizeObject(media.slice(0, 500));
      }
      if (Array.isArray(announcements)) {
        companyData.announcements = sanitizeObject(announcements.slice(0, 200));
      }
      if (typeof adminPassword === 'string' && adminPassword.trim().length >= 4) {
        companyData.adminPassword = sanitizeInput(adminPassword.trim());
      }
      if (typeof privateWebsitesPassword === 'string' && privateWebsitesPassword.trim().length >= 3) {
        companyData.privateWebsitesPassword = sanitizeInput(privateWebsitesPassword.trim());
      }
      companyData.updatedAt = Math.max(Date.now(), (companyData.updatedAt || 0) + 1);

      // Persist to disk
      try {
        fs.writeFileSync(dataFilePath, JSON.stringify(companyData, null, 2), 'utf-8');
      } catch (writeErr) {
        console.warn('Failed to write company_data.json:', writeErr);
      }

      // Broadcast immediately to every connected mobile, laptop, and tablet!
      broadcastUpdate();

      res.json({ success: true, updatedAt: companyData.updatedAt, data: companyData });
    } catch (err: any) {
      console.error('Sync update error:', err);
      res.status(500).json({ error: 'Failed to update company data' });
    }
  });

  // POST /api/support/report - Receive support reports / help center requests
  app.post('/api/support/report', (req, res) => {
    try {
      const report = sanitizeObject(req.body);
      if (!Array.isArray(companyData.reports)) {
        companyData.reports = [];
      }
      companyData.reports.unshift(report);
      if (companyData.reports.length > 200) {
        companyData.reports = companyData.reports.slice(0, 200);
      }
      companyData.updatedAt = Math.max(Date.now(), (companyData.updatedAt || 0) + 1);

      try {
        fs.writeFileSync(dataFilePath, JSON.stringify(companyData, null, 2), 'utf-8');
      } catch (writeErr) {
        console.warn('Failed to write company_data.json for report:', writeErr);
      }

      broadcastUpdate();
      res.json({ success: true, reports: companyData.reports });
    } catch (err: any) {
      console.error('Support report error:', err);
      res.status(500).json({ error: 'Failed to save support report' });
    }
  });

  // In-memory rate limiting to prevent spam and DDoS attacks on AI endpoints
  const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
  const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
  const MAX_REQUESTS_PER_WINDOW = 35;

  app.use('/api/gemini', (req, res, next) => {
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    const ipKey = String(clientIp);
    const now = Date.now();

    const record = rateLimitMap.get(ipKey);
    if (!record || now > record.resetTime) {
      rateLimitMap.set(ipKey, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
      return next();
    }

    if (record.count >= MAX_REQUESTS_PER_WINDOW) {
      return res.status(429).json({
        error: 'बहुत अधिक अनुरोध (Too Many Requests)। सुरक्षा कारणों से कृपया कुछ सेकंड प्रतीक्षा करें।'
      });
    }

    record.count += 1;
    next();
  });

  // Initialize Gemini AI client if API key exists
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

  // API endpoint for AI assistant / text generation
  app.post('/api/gemini', async (req, res) => {
    try {
      const { prompt } = req.body;
      const cleanPrompt = String(prompt || '').slice(0, 2000);
      const lowerPrompt = cleanPrompt.toLowerCase();

      // Check for sensitive queries (admin panel, employee info, private websites)
      const sensitiveKeywords = [
        'admin panel', 'एडमिन पैनल', 'password', 'passcode', 'admin password', 'एडमिन पासवर्ड', 'पासवर्ड', 'पिन',
        'employee', 'employees', 'staff', 'एम्प्लॉई', 'कर्मचारी', 'employee list', 'एम्प्लॉई लिस्ट',
        'private website', 'secret website', 'प्राइवेट वेबसाइट', 'गुप्त वेबसाइट', 'private portal', 'गुप्त पोर्टल',
        'mobile', 'phone', 'number', 'मोबाइल', 'नंबर', 'आधार', 'aadhaar'
      ];

      const isAskingSensitive = sensitiveKeywords.some(keyword => lowerPrompt.includes(keyword));

      if (isAskingSensitive) {
        return res.json({
          text: 'सुरक्षा नीति (Security Policy) और गोपनीयता प्रोटोकॉल के तहत एडमिन पैनल, कर्मचारियों (Employees) और प्राइवेट/गुप्त वेबसाइट्स के बारे में कोई भी जानकारी देना प्रतिबंधित है।'
        });
      }

      const publicWebsites = companyData.websites.filter(w => !w.isPrivate);
      const websiteCount = publicWebsites.length;
      const publicWebsiteDetails = publicWebsites.map(w => `- ${w.title} (${w.url}) [Category: ${w.category}]`).join('\n');

      const systemInstruction = `You are the intelligent corporate AI assistant for Free AI Vishal Company (फ्री एआई विशाल कंपनी, CEO: विशाल पटेल). 
Current Live Public Websites Connected in Real-Time:
- Total Public Websites: ${websiteCount}
- Connected Websites List:
${publicWebsiteDetails}

Rules:
1. STRICT SAFETY POLICY: You must NEVER reveal or discuss anything about the Admin Panel, employee details, staff list, or private/secret websites. If asked about them, strictly refuse and state it is against corporate security policy.
2. WEBSITE QUERY RULE: When asked to show websites ("अपनी वेबसाइट दिखाओ", "कौन सी वेबसाइट हैं", "वेबसाइट्स दिखाओ", "show websites"), list all connected public websites in real-time with their exact titles and URLs from the active inventory above.
3. Keep answers concise, helpful, and direct in Hindi.`;

      if (!ai) {
        return res.json({ 
          text: `फ्री एआई विशाल कंपनी (CEO: विशाल पटेल) आधिकारिक पोर्टल। आपके प्रश्न का संक्षिप्त उत्तर: यह कंपनी अत्याधुनिक एआई टूल्स और वेब पोर्टल्स का संचालन करती है।` 
        });
      }

      let response;
      try {
        response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: cleanPrompt,
          config: { 
            systemInstruction,
            temperature: 0.7,
            maxOutputTokens: 800
          }
        });
      } catch (err1) {
        try {
          response = await ai.models.generateContent({
            model: 'gemini-3.5-flash-lite',
            contents: cleanPrompt,
            config: { 
              systemInstruction,
              temperature: 0.7,
              maxOutputTokens: 800
            }
          });
        } catch (err2) {
          response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: cleanPrompt,
            config: { systemInstruction }
          });
        }
      }

      res.json({ text: response.text });
    } catch (error: any) {
      console.error('Gemini API Error:', error);
      const isQuota = error?.message?.includes('resource_exhausted') || error?.message?.includes('quota');
      const fallbackText = isQuota
        ? 'फ्री एआई विशाल कंपनी (CEO: विशाल पटेल): अभी एआई सर्वर पर अधिक ट्रैफिक या कोटा सीमा के कारण अनुरोध व्यस्त है। कृपया कुछ सेकंड बाद पुनः प्रयास करें।'
        : `फ्री एआई विशाल कंपनी (CEO: विशाल पटेल): आपकी बात दर्ज कर ली गई है। हमारे मुख्य पोर्टल्स पूरी तरह सक्रिय हैं।`;
      res.json({ text: fallbackText });
    }
  });

  const distPath = path.join(__dirname, 'dist');
  const indexHtmlPath = path.join(distPath, 'index.html');
  const hasDist = fs.existsSync(distPath) && fs.existsSync(indexHtmlPath);
  const isProduction = process.env.NODE_ENV === 'production' && hasDist;

  if (isProduction) {
    app.use(express.static(distPath));
    app.get('*', (req, res, next) => {
      if (fs.existsSync(indexHtmlPath)) {
        res.sendFile(indexHtmlPath);
      } else {
        next();
      }
    });
  } else {
    // Create Vite server in middleware mode
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        allowedHosts: true,
        host: '0.0.0.0',
        port: Number(PORT),
      },
      appType: 'spa',
    });

    app.use(vite.middlewares);
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
