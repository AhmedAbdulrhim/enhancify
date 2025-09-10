import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import fetch from 'cross-fetch';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({ origin: '*'}));
app.use(express.json({ limit: '1mb' }));

const limiter = rateLimit({ windowMs: 60 * 1000, limit: 30, standardHeaders: true, legacyHeaders: false });
app.use(limiter);

function isValidTikTokUrl(urlString) {
  try {
    const url = new URL(urlString);
    return /tiktok\.com$/.test(url.hostname) || /tiktokcdn\.com$/.test(url.hostname);
  } catch {
    return false;
  }
}

// Provider abstraction (RapidAPI or self-hosted extractor)
async function getTikTokDownloadInfo(videoUrl) {
  const provider = process.env.TIKTOK_PROVIDER || 'rapidapi';
  if (provider === 'rapidapi') {
    const rapidUrl = 'https://tiktok-video-no-watermark2.p.rapidapi.com/';
    const apiKey = process.env.RAPIDAPI_KEY;
    if (!apiKey) throw new Error('Missing RAPIDAPI_KEY');
    const res = await fetch(`${rapidUrl}?url=${encodeURIComponent(videoUrl)}` , {
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': 'tiktok-video-no-watermark2.p.rapidapi.com'
      }
    });
    if (!res.ok) throw new Error(`Provider error ${res.status}`);
    const data = await res.json();
    // Normalize a few common shapes
    const directUrl = data?.data?.play || data?.data?.hdplay || data?.data?.nowm || data?.nowm || data?.hdplay;
    if (!directUrl) throw new Error('No downloadable URL found');
    return { url: directUrl, meta: { cover: data?.data?.cover || data?.cover, desc: data?.data?.title || data?.title } };
  }
  throw new Error('Unsupported provider');
}

app.post('/api/tiktok', async (req, res) => {
  try {
    const { url } = req.body || {};
    if (!url || typeof url !== 'string' || !isValidTikTokUrl(url)) {
      return res.status(400).json({ error: 'Invalid TikTok URL' });
    }

    const info = await getTikTokDownloadInfo(url);
    return res.json({ downloadUrl: info.url, meta: info.meta });
  } catch (err) {
    return res.status(500).json({ error: err?.message || 'Internal error' });
  }
});

app.get('/health', (_req, res) => res.json({ ok: true }));

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on http://localhost:${port}`);
});

