import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { validateAdminRequest } from "@/lib/adminAuth";
import { DEFAULT_CONFIG } from "@/lib/config-defaults";
import type { SiteConfig } from "@/lib/config-defaults";

export async function GET(req: NextRequest) {
  if (!validateAdminRequest(req)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  const sql = getDb();
  const rows = await sql`SELECT data FROM site_config WHERE id = 1 LIMIT 1`.catch(() => []);
  const data: SiteConfig = rows.length > 0 ? { ...DEFAULT_CONFIG, ...rows[0].data } : { ...DEFAULT_CONFIG };
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  if (!validateAdminRequest(req)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  let body: Partial<SiteConfig>;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }
  const sql = getDb();
  await sql`
    INSERT INTO site_config (id, data, updated_at)
    VALUES (1, ${JSON.stringify(body)}::jsonb, NOW())
    ON CONFLICT (id) DO UPDATE SET data = ${JSON.stringify(body)}::jsonb, updated_at = NOW()
  `;
  return NextResponse.json({ ok: true });
}
