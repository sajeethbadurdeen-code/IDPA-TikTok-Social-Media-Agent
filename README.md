# IDPA TikTok Social Media Agent

Automated content generation and publishing pipeline for Interior Design Practical Academy's TikTok.

**Pipeline:** Firecrawl trend research → theme selection → NVIDIA NIM image/video generation → Claude caption writing → Supabase Storage upload → TikTok Content Posting API v2 publish.

## Deploying from iPhone (Working Copy → GitHub → Railway)

### 1. Get your API keys
Fill these in — see `.env.example` for the full list:
- **Anthropic** (console.anthropic.com) — caption writing
- **NVIDIA NIM** (build.nvidia.com) — image/video generation, key starts with `nvapi-`
- **Firecrawl** (firecrawl.dev) — trend research
- **Supabase service_role key** — already have the project (`liizflcfsckadfnapkey`), grab the service_role key from Project Settings → API
- **TikTok** — Client key/secret from developers.tiktok.com, access token from OAuth flow

### 2. Push this code to GitHub using Working Copy
1. Open Working Copy → create a new repository (or clone an empty GitHub repo you created on github.com)
2. Copy all files from this project into that repository folder in Working Copy
3. Commit and push to GitHub

### 3. Connect Railway to your GitHub repo
1. Open railway.com in Safari, log in
2. New Project → Deploy from GitHub repo → select your repo
3. Railway auto-detects the `Procfile` and Node engine — no extra config needed
4. Go to your service → Variables tab → add every key from `.env.example` with your real values
5. Railway will build and deploy automatically. Once live, open the generated `.up.railway.app` URL in Safari — that's your dashboard.

### 4. Test it
1. Open the dashboard URL, enter your `DASHBOARD_PASSWORD`
2. Select **Course Spotlight** as the theme and **Image only** as media type first (cheaper, no TikTok post) — confirm generation and upload work end to end
3. Once confirmed, switch media type to **Video** and run again — this will also publish to TikTok
4. Until your TikTok app passes audit, posts land as **private drafts (SELF_ONLY)** — open the TikTok app and tap Publish manually on each one

### 5. Going public on TikTok
Submit your app for TikTok's Content Posting API audit. Once approved, set `TIKTOK_APP_AUDITED=true` as a Railway variable — the pipeline will then post as `PUBLIC_TO_EVERYONE` automatically.

## Project structure
```
server.js              Express server + dashboard API
pipeline.js             Orchestrates all skills in sequence
skills/
  contentTheme.js       Rotating content themes
  trendResearch.js       Firecrawl trend lookup
  mediaGen.js            NVIDIA NIM image/video generation
  caption.js             Claude caption + hashtag writing
  upload.js              Supabase Storage upload
  tiktokPublish.js       TikTok Content Posting API v2
public/index.html       Black & gold dashboard UI
```
