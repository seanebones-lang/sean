/**
 * Sanity Studio only auto-loads env vars prefixed with `SANITY_STUDIO_`
 * (see https://www.sanity.io/docs/environment-variables).
 * Next.js often uses `NEXT_PUBLIC_SANITY_*` (may be inlined at build time).
 * Prefer `SANITY_PROJECT_ID` / `SANITY_DATASET` on the server so Vercel can
 * supply values at runtime without relying on a rebuild.
 */

function readEnv(...keys: string[]): string | undefined {
  for (const key of keys) {
    const value = process.env[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return undefined;
}

const projectId = readEnv(
  "SANITY_PROJECT_ID",
  "NEXT_PUBLIC_SANITY_PROJECT_ID",
  "SANITY_STUDIO_PROJECT_ID"
) ?? "7sodez5h";
const dataset =
  readEnv("SANITY_DATASET", "NEXT_PUBLIC_SANITY_DATASET", "SANITY_STUDIO_DATASET") ??
  "production";
const apiVersion =
  readEnv("SANITY_API_VERSION", "NEXT_PUBLIC_SANITY_API_VERSION", "SANITY_STUDIO_API_VERSION") ??
  "2026-04-16";

export const sanityEnv = {
  projectId,
  dataset,
  apiVersion,
  token: readEnv("SANITY_API_TOKEN"),
  isConfigured: Boolean(projectId && dataset),
};
