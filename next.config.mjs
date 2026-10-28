/** @type {import('next').NextConfig} */
const nextConfig = {
  /* No "X-Powered-By: Next.js" on every response: it tells a scanner which
     exploits to try first and tells a visitor nothing. */
  poweredByHeader: false,

  /* Every image this app renders is either bundled from assets/ or served by
     our own /api/members/<id>/photo route, so there is no remote host to allow.
     The scaffold this project grew out of listed Cloudinary and Unsplash; both
     are gone, and an empty list is one fewer origin the optimiser will fetch
     from on someone else's say-so. */
  images: {
    remotePatterns: [],
  },

  /* Activities, Gallery and Videos were three routes describing one thing at
     three moments of its life, and are now /media. These are permanent because
     the old URLs have been in the navigation and the footer — anything already
     shared or indexed should land on the merged page rather than a 404, and the
     anchor puts the visitor in the part they were looking for. */
  async redirects() {
    return [
      { source: "/activities", destination: "/media#activities", permanent: true },
      { source: "/gallery", destination: "/media#photographs", permanent: true },
      { source: "/videos", destination: "/media#video", permanent: true },
      /* The candidate's own site calls these /manifesto and /about, and
         people will type what they have seen there. */
      { source: "/agenda", destination: "/manifesto", permanent: true },
      { source: "/registration", destination: "/join", permanent: true },
      { source: "/support", destination: "/volunteer", permanent: true },
    ];
  },

  /* The register is not a public document. These are belt-and-braces on top of
     the per-route `robots` metadata: a crawler that ignores the meta tag still
     sees the header, and the frame rules stop a signed-in coordinator's
     dashboard being embedded in somebody else's page. */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          /* HTTPS only, for two years, once a browser has seen the site over
             it. Ignored on plain http://localhost, so development is unaffected. */
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
        ],
      },
      {
        // Nothing behind a sign-in should ever sit in a shared cache.
        source: "/(admin|portal)/:path*",
        headers: [{ key: "Cache-Control", value: "private, no-store" }],
      },
    ];
  },
};

export default nextConfig;
