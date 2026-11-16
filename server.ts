import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import http from 'http';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';
import { INITIAL_PORTFOLIO_DATA } from './src/data/initialPortfolio';
import { PortfolioData } from './src/types/portfolio';

const PORT = 3000;
const DATA_DIR = path.resolve(process.cwd(), 'data');
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');
const STORE_PATH = path.join(DATA_DIR, 'portfolio-store.json');
const AUTH_PATH = path.join(DATA_DIR, 'studio-auth.json');
const SECRET_PATH = path.join(DATA_DIR, 'session.key');
const DEFAULT_CV_PDF = path.resolve(
  process.cwd(),
  'public/assets/aistudio/CV_de_Ce_drine_PIGEON-SCHNEIDER_ac537d40.pdf'
);
const DEFAULT_MOODBOARD_PDF = path.resolve(
  process.cwd(),
  'public/assets/aistudio/Moodboard_-_copie_e766ab12.pdf'
);

fs.mkdirSync(UPLOADS_DIR, { recursive: true });

interface StoreFile {
  published: PortfolioData;
  draft: PortfolioData;
}

interface AuthFile {
  passcodeHash: string | null;
  salt: string | null;
}

function getSessionSecret(): string {
  if (process.env.SESSION_SECRET) return process.env.SESSION_SECRET;
  if (fs.existsSync(SECRET_PATH)) {
    return fs.readFileSync(SECRET_PATH, 'utf-8').trim();
  }
  const secret = crypto.randomBytes(32).toString('hex');
  fs.writeFileSync(SECRET_PATH, secret, 'utf-8');
  return secret;
}

const SESSION_SECRET = getSessionSecret();

function loadStore(): StoreFile {
  if (fs.existsSync(STORE_PATH)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(STORE_PATH, 'utf-8')) as StoreFile;
      if (parsed && parsed.published && parsed.draft) {
        // If store still holds unpopulated initial defaults, seed with extracted CV & Moodboard assets
        if (!parsed.published.publishedAt && !parsed.published.portrait) {
          const seeded: StoreFile = {
            published: structuredClone(INITIAL_PORTFOLIO_DATA),
            draft: structuredClone(INITIAL_PORTFOLIO_DATA),
          };
          saveStore(seeded);
          return seeded;
        }
        return parsed;
      }
    } catch {
      // Fallback to initial store
    }
  }
  const initial: StoreFile = {
    published: structuredClone(INITIAL_PORTFOLIO_DATA),
    draft: structuredClone(INITIAL_PORTFOLIO_DATA),
  };
  fs.writeFileSync(STORE_PATH, JSON.stringify(initial, null, 2), 'utf-8');
  return initial;
}

function saveStore(store: StoreFile): void {
  fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), 'utf-8');
}

function loadAuth(): AuthFile {
  if (process.env.STUDIO_PASSCODE) {
    const salt = 'env-salt';
    const hash = crypto.scryptSync(process.env.STUDIO_PASSCODE, salt, 64).toString('hex');
    return { passcodeHash: hash, salt };
  }
  if (fs.existsSync(AUTH_PATH)) {
    try {
      return JSON.parse(fs.readFileSync(AUTH_PATH, 'utf-8')) as AuthFile;
    } catch {
      // ignore
    }
  }
  const initial: AuthFile = { passcodeHash: null, salt: null };
  fs.writeFileSync(AUTH_PATH, JSON.stringify(initial, null, 2), 'utf-8');
  return initial;
}

function saveAuth(auth: AuthFile): void {
  fs.writeFileSync(AUTH_PATH, JSON.stringify(auth, null, 2), 'utf-8');
}

function hashPasscode(passcode: string, salt: string): string {
  return crypto.scryptSync(passcode, salt, 64).toString('hex');
}

function signToken(payload: { role: 'owner'; exp: number }): string {
  const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', SESSION_SECRET).update(data).digest('base64url');
  return `${data}.${sig}`;
}

function verifyToken(token: string | undefined): boolean {
  if (!token || !token.includes('.')) return false;
  const [data, sig] = token.split('.');
  const expected = crypto.createHmac('sha256', SESSION_SECRET).update(data).digest('base64url');
  if (sig.length !== expected.length) return false;
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return false;
  try {
    const parsed = JSON.parse(Buffer.from(data, 'base64url').toString('utf-8'));
    return parsed.role === 'owner' && typeof parsed.exp === 'number' && parsed.exp > Date.now();
  } catch {
    return false;
  }
}

function extractToken(req: Request): string | undefined {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7).trim();
  }
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return undefined;
  const parts = cookieHeader.split(';').map((c) => c.trim());
  for (const part of parts) {
    if (part.startsWith('pigeon_studio=')) {
      return decodeURIComponent(part.slice('pigeon_studio='.length));
    }
  }
  return undefined;
}

function requireOwner(req: Request, res: Response, next: NextFunction): void {
  const token = extractToken(req);
  if (!verifyToken(token)) {
    res.status(401).json({ error: 'Authentification requise pour accéder à votre espace privé.' });
    return;
  }
  next();
}

function sanitizePdfText(text: string): string {
  // Convert French accented characters to WinAnsi-safe ASCII/Latin-1 bytes for Helvetica built-in font
  return text
    .replace(/’/g, "'")
    .replace(/–/g, '-')
    .replace(/·/g, '-')
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
}

function buildFallbackCvPdf(): Buffer {
  const lines: Array<{ text: string; size: number; bold?: boolean; gap?: number }> = [
    { text: 'CEDRINE PIGEON-SCHNEIDER', size: 20, bold: true, gap: 24 },
    { text: "Creative dans l'ame, stratege dans la tete.", size: 12, gap: 18 },
    { text: 'Recherche une alternance de 2 ans (2026-2028) en Marketing & Communication', size: 11, bold: true, gap: 18 },
    { text: 'Chessy (77700) - Mobilite : Chessy, Meaux et RER A jusqu a Paris', size: 10, gap: 14 },
    { text: 'E-mail : pigeon-schneider@outlook.fr | LinkedIn : linkedin.com/in/cedrine-pigeon-schneider', size: 10, gap: 22 },

    { text: 'FORMATION', size: 12, bold: true, gap: 16 },
    { text: '2026-2028 : Mastere Strategie Marketing - Ascencia Business School (2j ecole / 3j entreprise)', size: 10, gap: 14 },
    { text: '2025 : Formation en mediation de la consommation (IGPDE)', size: 10, gap: 14 },
    { text: '2023 : Certification Management & Leadership (Udemy)', size: 10, gap: 14 },
    { text: '2017-2019 : Mastere Droit des affaires & Master Droit de la propriete intellectuelle - Toulouse 1 Capitole', size: 10, gap: 14 },
    { text: '2013-2017 : Licence de droit - Universite de Bordeaux', size: 10, gap: 20 },

    { text: 'EXPERIENCES PROFESSIONNELLES', size: 12, bold: true, gap: 16 },
    { text: "oct. 2025 - juin 2026 : Juriste chargee de mediation - Mediation de l'Eau, Paris (CDI)", size: 10, gap: 14 },
    { text: '2023-2024 : Manager de proximite - MMA Assurances, Chartres (KPI, reunions, comm interne)', size: 10, gap: 14 },
    { text: '2022-2023 : Assistante communication benevole (Contenus LinkedIn, veille, benchmark)', size: 10, gap: 14 },
    { text: '2020-2024 : Juriste protection juridique - Covea, Noisy-le-Grand (CDI)', size: 10, gap: 14 },
    { text: "2019 : Stage de fin d'etudes - INPI, Toulouse (Prospection entreprises, veille, notes de synthese)", size: 10, gap: 20 },

    { text: 'COMPETENCES & OUTILS', size: 12, bold: true, gap: 16 },
    { text: 'Creation & Contenus : Figma, Canva, Milanote, formats LinkedIn (photos, carrousels, videos)', size: 10, gap: 14 },
    { text: 'Strategie & Gestion : Veille editoriale, benchmark, suivi KPI, animation de reunions, CRM, Pack Office', size: 10, gap: 14 },
    { text: 'Langue & Interets : Anglais B1 | Ecriture (projet de publication) | Musique (classique, jazz, pop, rock)', size: 10, gap: 14 },
  ];

  let y = 780;
  const ops: string[] = ['BT'];
  for (const line of lines) {
    const font = line.bold ? '/F2' : '/F1';
    ops.push(`${font} ${line.size} Tf`);
    ops.push(`1 0 0 1 48 ${y} Tm`);
    ops.push(`(${sanitizePdfText(line.text)}) Tj`);
    y -= line.gap ?? 16;
  }
  ops.push('ET');
  const streamContent = ops.join('\n');

  const objects: string[] = [
    '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n',
    '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n',
    '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>\nendobj\n',
    `4 0 obj\n<< /Length ${Buffer.byteLength(streamContent, 'latin1')} >>\nstream\n${streamContent}\nendstream\nendobj\n`,
    '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>\nendobj\n',
    '6 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>\nendobj\n',
  ];

  let pdf = '%PDF-1.4\n';
  const offsets: number[] = [0];
  for (const obj of objects) {
    offsets.push(Buffer.byteLength(pdf, 'latin1'));
    pdf += obj;
  }
  const xrefOffset = Buffer.byteLength(pdf, 'latin1');
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let i = 1; i <= objects.length; i++) {
    pdf += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

  return Buffer.from(pdf, 'latin1');
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '20mb' }));

  // Serve uploaded files safely
  app.use('/uploads', express.static(UPLOADS_DIR, { maxAge: '7d' }));

  // Public portfolio endpoint
  app.get('/api/portfolio', (_req, res) => {
    const store = loadStore();
    res.json(store.published);
  });

  // Downloadable or inline-previewable CV PDF
  app.get('/api/cv', (req, res) => {
    const customCvPath = path.join(UPLOADS_DIR, 'custom-cv.pdf');
    const filename = 'CV_de_Cedrine_PIGEON-SCHNEIDER.pdf';
    const isInline = req.query.inline === '1';
    const disposition = isInline ? 'inline' : 'attachment';
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader(
      'Content-Disposition',
      `${disposition}; filename="${filename}"; filename*=UTF-8''CV_de_C%C3%A9drine_PIGEON-SCHNEIDER.pdf`
    );
    if (fs.existsSync(customCvPath)) {
      res.sendFile(customCvPath);
      return;
    }
    if (fs.existsSync(DEFAULT_CV_PDF)) {
      res.sendFile(DEFAULT_CV_PDF);
      return;
    }
    res.send(buildFallbackCvPdf());
  });

  // Downloadable Moodboard PDF
  app.get('/api/moodboard-pdf', (_req, res) => {
    const filename = 'Moodboard_Cedrine_PIGEON-SCHNEIDER.pdf';
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${filename}"; filename*=UTF-8''Moodboard_C%C3%A9drine_PIGEON-SCHNEIDER.pdf`
    );
    if (fs.existsSync(DEFAULT_MOODBOARD_PDF)) {
      res.sendFile(DEFAULT_MOODBOARD_PDF);
      return;
    }
    res.status(404).json({ error: 'Moodboard PDF introuvable.' });
  });

  // Studio authentication status
  app.get('/api/studio/status', (req, res) => {
    const auth = loadAuth();
    const token = extractToken(req);
    const authenticated = verifyToken(token);
    res.json({
      isInitialized: Boolean(auth.passcodeHash),
      authenticated,
    });
  });

  // Initialize or sign in with passcode
  app.post('/api/studio/auth', (req, res) => {
    const { passcode } = req.body as { passcode?: string };
    if (!passcode || typeof passcode !== 'string' || passcode.trim().length < 4) {
      res.status(400).json({ error: 'Veuillez saisir un code d’accès d’au moins 4 caractères.' });
      return;
    }

    const cleanCode = passcode.trim();
    const auth = loadAuth();

    if (!auth.passcodeHash || !auth.salt) {
      const salt = crypto.randomBytes(16).toString('hex');
      const passcodeHash = hashPasscode(cleanCode, salt);
      saveAuth({ passcodeHash, salt });
    } else {
      const attempt = hashPasscode(cleanCode, auth.salt);
      const aBuf = Buffer.from(attempt, 'hex');
      const bBuf = Buffer.from(auth.passcodeHash, 'hex');
      if (aBuf.length !== bBuf.length || !crypto.timingSafeEqual(aBuf, bBuf)) {
        res.status(401).json({ error: 'Code d’accès incorrect.' });
        return;
      }
    }

    const token = signToken({ role: 'owner', exp: Date.now() + 7 * 24 * 60 * 60 * 1000 });
    res.cookie('pigeon_studio', token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({ authenticated: true, token });
  });

  app.post('/api/studio/logout', (_req, res) => {
    res.clearCookie('pigeon_studio');
    res.json({ ok: true });
  });

  // Change owner passcode
  app.post('/api/studio/passcode', requireOwner, (req, res) => {
    const { newPasscode } = req.body as { newPasscode?: string };
    if (!newPasscode || typeof newPasscode !== 'string' || newPasscode.trim().length < 4) {
      res.status(400).json({ error: 'Le nouveau code doit contenir au moins 4 caractères.' });
      return;
    }
    const salt = crypto.randomBytes(16).toString('hex');
    const passcodeHash = hashPasscode(newPasscode.trim(), salt);
    saveAuth({ passcodeHash, salt });
    res.json({ ok: true });
  });

  // Get draft + published state
  app.get('/api/studio/state', requireOwner, (_req, res) => {
    const store = loadStore();
    const hasUnpublishedChanges =
      JSON.stringify(store.draft) !== JSON.stringify(store.published);
    res.json({
      published: store.published,
      draft: store.draft,
      hasUnpublishedChanges,
    });
  });

  // Update full draft
  app.put('/api/studio/draft', requireOwner, (req, res) => {
    const { draft } = req.body as { draft?: PortfolioData };
    if (!draft || typeof draft !== 'object') {
      res.status(400).json({ error: 'Données de brouillon invalides.' });
      return;
    }
    const store = loadStore();
    store.draft = draft;
    saveStore(store);
    res.json({
      published: store.published,
      draft: store.draft,
      hasUnpublishedChanges: JSON.stringify(store.draft) !== JSON.stringify(store.published),
    });
  });

  // Upload image or PDF file (base64 data URL)
  app.post('/api/studio/upload', requireOwner, (req, res) => {
    const { dataUrl, filename, kind } = req.body as {
      dataUrl?: string;
      filename?: string;
      kind?: 'image' | 'cv';
    };

    if (!dataUrl || typeof dataUrl !== 'string') {
      res.status(400).json({ error: 'Fichier manquant.' });
      return;
    }

    const match = dataUrl.match(/^data:([a-zA-Z0-9/+.-]+);base64,(.+)$/);
    if (!match) {
      res.status(400).json({ error: 'Format de fichier non reconnu.' });
      return;
    }

    const mime = match[1];
    const buffer = Buffer.from(match[2], 'base64');

    if (kind === 'cv') {
      if (mime !== 'application/pdf') {
        res.status(400).json({ error: 'Veuillez importer un fichier PDF pour le CV.' });
        return;
      }
      const cvPath = path.join(UPLOADS_DIR, 'custom-cv.pdf');
      fs.writeFileSync(cvPath, buffer);
      const store = loadStore();
      store.draft.hasCustomCv = true;
      saveStore(store);
      res.json({ ok: true, hasCustomCv: true });
      return;
    }

    const extMap: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/jpg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
      'image/gif': 'gif',
    };
    const ext = extMap[mime];
    if (!ext) {
      res.status(400).json({ error: 'Format image supporté : JPG, PNG, WebP ou GIF.' });
      return;
    }

    const safeBase = (filename || 'visuel')
      .replace(/\.[^.]+$/, '')
      .replace(/[^a-zA-Z0-9_-]/g, '-')
      .slice(0, 32);
    const outName = `${Date.now()}-${safeBase}.${ext}`;
    fs.writeFileSync(path.join(UPLOADS_DIR, outName), buffer);

    res.json({
      url: `/uploads/${outName}`,
    });
  });

  // One-click publish
  app.post('/api/studio/publish', requireOwner, (_req, res) => {
    const store = loadStore();
    store.draft.publishedAt = new Date().toISOString();
    store.published = structuredClone(store.draft);
    saveStore(store);
    res.json({
      published: store.published,
      draft: store.draft,
      hasUnpublishedChanges: false,
    });
  });

  const httpServer = http.createServer(app);

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR === 'true' ? false : { server: httpServer },
        ws: { server: httpServer },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`PIGEON. server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
