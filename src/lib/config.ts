import { getDb } from "@/lib/db";

export interface SiteConfig {
  locale: string;
  currency: string;
  price: string;
  checkoutUrl: string;
  firstButtonText: string;
  purchaseButtonText: string;
}

export const DEFAULT_CONFIG: SiteConfig = {
  locale: "es-AR",
  currency: "ARS",
  price: "$3.500",
  checkoutUrl: "https://pay.hotmart.com/T106028174P?checkoutMode=10",
  firstButtonText: "CREAR MI FIGURITA",
  purchaseButtonText: "⚽ DESBLOQUEAR MI FIGURITA",
};

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
