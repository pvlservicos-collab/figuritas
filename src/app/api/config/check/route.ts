import { NextRequest, NextResponse } from "next/server";
import { validateAdminRequest } from "@/lib/adminAuth";
import { getDb } from "@/lib/db";

export async function GET(req: NextRequest) {
  if (!validateAdminRequest(req)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const results: Record<string, boolean | string> = {};

  // DATABASE_URL
  try {
    const sql = getDb();
    await sql`SELECT 1`;
    results.DATABASE_URL = true;
  } catch (e) {
    results.DATABASE_URL = false;
    results.DATABASE_URL_error = e instanceof Error ? e.message.slice(0, 80) : String(e);
  }

  // BLOB_READ_WRITE_TOKEN
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN ?? "";
  results.BLOB_READ_WRITE_TOKEN = blobToken.length > 10;

  // OPENAI_API_KEY (aceita múltiplas chaves)
  const openaiKey = process.env.OPENAI_API_KEY ?? "";
  results.OPENAI_API_KEY = openaiKey.startsWith("sk-") && openaiKey.length > 20;

  return NextResponse.json(results);
}
