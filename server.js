require('dotenv').config();
const express = require('express');
const path = require('path');
const { runPipeline } = require('./pipeline');
const { THEMES } = require('./skills/contentTheme');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Simple shared-password gate so the public Railway URL isn't wide open
function checkPassword(req, res, next) {
  const provided = req.headers['x-dashboard-password'] || req.query.password;
  if (!process.env.DASHBOARD_PASSWORD || provided === process.env.DASHBOARD_PASSWORD) {
    return next();
  }
  res.status(401).json({ error: 'Invalid dashboard password' });
}

app.get('/api/themes', (req, res) => {
  res.json(Object.entries(THEMES).map(([key, t]) => ({ key, label: t.label })));
});

app.post('/api/generate-and-post', checkPassword, async (req, res) => {
  const { themeKey, mediaType } = req.body;
  const logLines = [];
  const result = await runPipeline({
    themeKey,
    mediaType: mediaType || 'video',
    log: (msg) => logLines.push(msg)
  });
  res.json({ ...result, logLines });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`IDPA TikTok agent dashboard running on port ${PORT}`);
});
