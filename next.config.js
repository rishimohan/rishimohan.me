module.exports = {
  // Short links for Upwards. Point /upwards/download at the newest DMG in public/downloads on each release.
  async redirects() {
    return [
      { source: "/upwards", destination: "/projects/upwards", permanent: false },
      { source: "/upwards/download", destination: "/downloads/Upwards-0.1.0.dmg", permanent: false },
    ];
  },

  // DataFast is served from our own origin so tracker blockers cannot drop it.
  // The script posts to <origin>/api/events whenever its src is not on
  // datafa.st, so both rewrites are needed.
  async rewrites() {
    return [
      {
        source: "/js/fast-script.js",
        destination: "https://datafa.st/js/script.js",
      },
      {
        source: "/api/events",
        destination: "https://datafa.st/api/events",
      },
      // PostHog for the Upwards page's download events (pages/projects/upwards.js).
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ];
  },

  env: {
    instagram: "thelifeofrishi",
    twitter: "thelifeofrishi",
  }
}