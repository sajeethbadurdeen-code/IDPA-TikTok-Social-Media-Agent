const fetch = require('node-fetch');

/**
 * Generates an image using NVIDIA NIM's FLUX.1-dev model.
 * Returns base64 image data.
 */
async function generateImage(prompt) {
  const response = await fetch(
    'https://ai.api.nvidia.com/v1/genai/black-forest-labs/flux.1-dev',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NVIDIA_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        prompt,
        width: 1024,
        height: 1024,
        mode: 'base',
        seed: 0,
        steps: 30
      })
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`NVIDIA image generation failed (${response.status}): ${errText}`);
  }

  const data = await response.json();
  // NIM returns base64 in an artifacts array
  const base64 = data.artifacts?.[0]?.base64 || data.image;
  if (!base64) throw new Error('No image data returned from NVIDIA NIM');
  return base64;
}

/**
 * Generates a short video using NVIDIA NIM's WAN2.2 model.
 * Returns base64 video data. Video generation is slower — expect 30-90s.
 */
async function generateVideo(prompt) {
  const response = await fetch(
    'https://ai.api.nvidia.com/v1/genai/wan/wan2.2',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NVIDIA_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        prompt,
        duration_seconds: 5,
        resolution: '720p'
      })
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`NVIDIA video generation failed (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const base64 = data.artifacts?.[0]?.base64 || data.video;
  if (!base64) throw new Error('No video data returned from NVIDIA NIM');
  return base64;
}

module.exports = { generateImage, generateVideo };
