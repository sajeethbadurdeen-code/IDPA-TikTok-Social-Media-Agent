const fetch = require('node-fetch');

/**
 * Uses Claude to write a TikTok caption + hashtags for the academy,
 * grounded in the theme and any trend research gathered earlier.
 */
async function writeCaption(themeLabel, trendInsights) {
  const trendContext = trendInsights.length
    ? `Relevant current context:\n${trendInsights.map(i => `- ${i.title}: ${i.snippet}`).join('\n')}`
    : '';

  const prompt = `You are writing a TikTok caption for Interior Design Practical Academy,
a Sri Lankan academy (Akaraipattu) teaching interior design, AutoCAD, SketchUp, V-Ray,
BOQ, site execution, and client presentation. Trainer: Badurdeen Sajeeth, 13 years
experience in Qatar. Brand tone: professional but approachable, black & gold identity.

Post theme: ${themeLabel}
${trendContext}

Write:
1. A short, catchy caption (2-3 sentences, TikTok style, can include 1-2 emojis)
2. 5-8 relevant hashtags

Respond ONLY as JSON: {"caption": "...", "hashtags": ["...", "..."]}`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 400,
      messages: [{ role: 'user', content: prompt }]
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Claude caption generation failed (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const textBlock = data.content.find(b => b.type === 'text');
  const raw = textBlock ? textBlock.text.trim() : '{}';
  const cleaned = raw.replace(/^```json\s*|\s*```$/g, '');

  try {
    return JSON.parse(cleaned);
  } catch {
    return { caption: raw, hashtags: ['#InteriorDesignSriLanka', '#IDPA'] };
  }
}

module.exports = { writeCaption };
