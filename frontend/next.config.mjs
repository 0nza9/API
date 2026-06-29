import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pin the workspace root to this folder; otherwise Next detects the stray
  // lockfile at C:\Users\Nathan and warns about an ambiguous root.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
