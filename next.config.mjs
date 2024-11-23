/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
};

import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: false,
  workboxOptions: {
    disableDevLogs: true,
    // runtimeCaching: true,
  },
});

export default withPWA(nextConfig);
