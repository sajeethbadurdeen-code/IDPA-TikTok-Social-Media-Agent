const fetch = require('node-fetch');

/**
 * Uses Firecrawl to research current interior-design / fit-out trends
 * so captions and themes stay relevant instead of generic.
 */
async function researchTrends(theme) {
  const query = `interior design fit-out trends TikTok 2026 ${theme}`;

  const response = await fetch('https://api.firecrawl.dev/v2/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.FIRECRAWL_API_KEY}`
    },
    body: JSON.stringify({ query, limit: 5 })
  });

  if (!response.ok) {
    console.warn('Firecrawl request failed, continuing with theme only:', response.status);
    return { theme, insights: [] };
  }

  const data = await response.json();
  const insights = (data.data || []).map(r => ({
    title: r.title,
    url: r.url,
    snippet: r.description || ''
  }));

  return { theme, insights };
}

module.exports = { researchTrends };
