import { getDb } from "@/lib/db";
export type { SiteConfig } from "./config-defaults";
export { DEFAULT_CONFIG } from "./config-defaults";
import { DEFAULT_CONFIG } from "./config-defaults";
import type { SiteConfig } from "./config-defaults";

export async function getConfig(): Promise<SiteConfig> {
  try {
    const sql = getDb();
    const rows = await sql<{ data: SiteConfig }[]>`
      SELECT data FROM site_config WHERE id = 1 LIMIT 1
    `;
    if (rows.length > 0 && rows[0].data) {
      return { ...DEFAULT_CONFIG, ...rows[0].data };
    }
  } catch {
    // DB not ready — use default
  }
  return DEFAULT_CONFIG;
}
