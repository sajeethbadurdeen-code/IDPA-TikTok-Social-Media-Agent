const fetch = require('node-fetch');

/**
 * Publishes a video to TikTok via the Content Posting API v2 (PULL_FROM_URL method).
 * Until your app passes TikTok's audit, privacy_level must be SELF_ONLY —
 * the post lands as a private draft you tap to publish from the TikTok app.
 */
async function publishToTikTok(videoUrl, caption) {
  const privacyLevel = process.env.TIKTOK_APP_AUDITED === 'true' ? 'PUBLIC_TO_EVERYONE' : 'SELF_ONLY';

  const response = await fetch('https://open.tiktokapis.com/v2/post/publish/video/init/', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.TIKTOK_ACCESS_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      post_info: {
        title: caption,
        privacy_level: privacyLevel,
        disable_duet: false,
        disable_comment: false,
        disable_stitch: false
      },
      source_info: {
        source: 'PULL_FROM_URL',
        video_url: videoUrl
      }
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`TikTok publish failed (${response.status}): ${errText}`);
  }

  const data = await response.json();
  return {
    publishId: data.data?.publish_id,
    privacyLevel,
    note: privacyLevel === 'SELF_ONLY'
      ? 'Posted as a private draft — open TikTok app to review and tap Publish.'
      : 'Posted publicly.'
  };
}

module.exports = { publishToTikTok };
