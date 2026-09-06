const { selectTheme } = require('./skills/contentTheme');
const { researchTrends } = require('./skills/trendResearch');
const { generateImage, generateVideo } = require('./skills/mediaGen');
const { writeCaption } = require('./skills/caption');
const { uploadMedia } = require('./skills/upload');
const { publishToTikTok } = require('./skills/tiktokPublish');

/**
 * Full pipeline: research -> theme -> generate media -> caption -> upload -> publish.
 * Each step logs progress so the dashboard can stream status back to the user.
 */
async function runPipeline({ themeKey, mediaType = 'video', log = console.log }) {
  const steps = [];
  const record = (step, status, detail) => {
    const entry = { step, status, detail, time: new Date().toISOString() };
    steps.push(entry);
    log(`[${step}] ${status}${detail ? ' — ' + detail : ''}`);
    return entry;
  };

  try {
    const theme = selectTheme(themeKey);
    record('theme', 'done', theme.label);

    const trends = await researchTrends(theme.label);
    record('trend-research', 'done', `${trends.insights.length} insights found`);

    let mediaUrl, contentType, filename;
    if (mediaType === 'video') {
      const base64 = await generateVideo(theme.prompt);
      filename = `videos/${theme.key}-${Date.now()}.mp4`;
      contentType = 'video/mp4';
      mediaUrl = await uploadMedia(base64, filename, contentType);
    } else {
      const base64 = await generateImage(theme.prompt);
      filename = `images/${theme.key}-${Date.now()}.png`;
      contentType = 'image/png';
      mediaUrl = await uploadMedia(base64, filename, contentType);
    }
    record('media-generation', 'done', mediaUrl);

    const { caption, hashtags } = await writeCaption(theme.label, trends.insights);
    const fullCaption = `${caption}\n\n${hashtags.join(' ')}`;
    record('caption', 'done', fullCaption);

    let publishResult = { note: 'Skipped — image posts are not published automatically, only video.' };
    if (mediaType === 'video') {
      publishResult = await publishToTikTok(mediaUrl, fullCaption);
      record('publish', 'done', publishResult.note);
    }

    return { success: true, theme: theme.label, mediaUrl, caption: fullCaption, publishResult, steps };
  } catch (err) {
    record('error', 'failed', err.message);
    return { success: false, error: err.message, steps };
  }
}

module.exports = { runPipeline };
