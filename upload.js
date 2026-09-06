const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * Uploads generated media (base64) to the social-media-assets bucket
 * and returns a public URL for TikTok to fetch from.
 */
async function uploadMedia(base64Data, filename, contentType) {
  const buffer = Buffer.from(base64Data, 'base64');
  const bucket = process.env.SUPABASE_BUCKET || 'social-media-assets';

  const { error } = await supabase.storage
    .from(bucket)
    .upload(filename, buffer, { contentType, upsert: true });

  if (error) throw new Error(`Supabase upload failed: ${error.message}`);

  const { data } = supabase.storage.from(bucket).getPublicUrl(filename);
  return data.publicUrl;
}

module.exports = { uploadMedia };
