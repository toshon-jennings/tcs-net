/** @type {import('next').NextConfig} */

// When building for GitHub Pages (project site served at /tcs-net/),
// the Actions workflow sets GITHUB_PAGES=true so we add the basePath.
const isPages = process.env.GITHUB_PAGES === "true";
const repo = "tcs-net";

const nextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  ...(isPages
    ? { basePath: `/${repo}`, assetPrefix: `/${repo}/` }
    : {}),
};

export default nextConfig;
