/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/dashboard",
        permanent: false,
      },
      {
        source: "/whatif-simulator",
        destination: "/simulator",
        permanent: false,
      },
      {
        source: "/career-path",
        destination: "/candidate-career-path",
        permanent: false,
      },
      {
        source: "/ingestion",
        destination: "/data-management",
        permanent: false,
      },
      {
        source: "/radar",
        destination: "/labour-market",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
