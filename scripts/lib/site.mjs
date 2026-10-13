// The campaign's address, in one place for everything that prints it: the beer mat back
// (scripts/build-mats.mjs) and the flyers (scripts/build-flyers.mjs). It is the domain the
// campaign is buying, not the workers.dev address the site is served from today, so point the
// domain at the Worker before anything carrying it is printed. Set SITE_URL in the env to
// override (for a proof, say), and rebuild both after changing it: the QR codes and the written
// address are baked into the artwork.
export const SITE_URL = process.env.SITE_URL || 'https://dontqueueatthebar.co.uk/';
export const DOMAIN = new URL(SITE_URL).hostname.replace(/^www\./, '');
