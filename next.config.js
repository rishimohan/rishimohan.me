module.exports = {
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
    ];
  },

  env: {
    instagram: "thelifeofrishi",
    twitter: "thelifeofrishi",
  }
}