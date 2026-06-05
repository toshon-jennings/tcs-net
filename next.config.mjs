/** @type {import('next').NextConfig} */

// When building for GitHub Pages (project site served at /tcs-net/),
// the Actions workflow sets GITHUB_PAGES=true so we add the basePath.
const isPages = process.env.GITHUB_PAGES === "true";
const repo = "tcs-net";
const basePath = isPages ? `/${repo}` : "";

const nextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  // Exposed to the client so static <img>/asset URLs can be prefixed too,
  // since next/image with `unoptimized` does not apply basePath to src.
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
