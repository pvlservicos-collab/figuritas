"use client";

import { useState, useEffect, useCallback } from "react";
import { DEFAULT_CONFIG } from "@/lib/config-defaults";
import type { SiteConfig } from "@/lib/config-defaults";

type Tab = "config" | "check";

interface CheckResult {
  DATABASE_URL: boolean;
  BLOB_READ_WRITE_TOKEN: boolean;
  OPENAI_API_KEY: boolean;
  DATABASE_URL_error?: string;
}

const FIELD_LABELS: Record<keyof SiteConfig, string> = {
  locale: "Locale (ex: es-AR)",
  currency: "Moeda (ex: ARS)",
  price: "Preço (ex: $3.500)",
  checkoutUrl: "URL do Checkout",
  firstButtonText: "Texto do 1º botão (Hero)",
  purchaseButtonText: "Texto do botão de compra (ResultScreen)",
};

export default function ConfigPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [tab, setTab] = useState<Tab>("config");

  // Config form
  const [form, setForm] = useState<SiteConfig>({ ...DEFAULT_CONFIG });
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  // Check tab
  const [checkResult, setCheckResult] = useState<CheckResult | null>(null);
  const [checking, setChecking] = useState(false);

  const loadConfig = useCallback(async () => {
    const res = await fetch("/api/config");
    if (res.ok) setForm(await res.json());
  }, []);

  // Check if already logged in
  useEffect(() => {
    fetch("/api/config").then(r => {
      if (r.ok) { setAuthed(true); loadConfig(); }
      else setAuthed(false);
    }).catch(() => setAuthed(false));
  }, [loadConfig]);

  const handleLogin = async () => {
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) { setAuthed(true); loadConfig(); }
    else setLoginError("Senha incorreta.");
  };

  const handleSave = async () => {
    setSaving(true); setSaveMsg(null);
    const res = await fetch("/api/config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setSaveMsg(res.ok ? "✅ Salvo com sucesso!" : "❌ Erro ao salvar.");
    setTimeout(() => setSaveMsg(null), 3000);
  };

  const handleCheck = async () => {
    setChecking(true); setCheckResult(null);
    const res = await fetch("/api/config/check");
    setChecking(false);
    if (res.ok) setCheckResult(await res.json());
  };

  if (authed === null) {
    return <div style={styles.center}>Carregando...</div>;
  }

  if (!authed) {
    return (
      <div style={styles.center}>
        <div style={styles.loginBox}>
          <h1 style={{ margin: "0 0 20px", fontSize: 22, color: "#002395" }}>🔐 Config — Figurita Copa AR</h1>
          <input
            type="password"
            value={password}
            onChange={e => { setPassword(e.target.value); setLoginError(""); }}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            placeholder="Senha do painel"
            autoFocus
            style={styles.input}
          />
          {loginError && <p style={{ color: "#dc2626", margin: "4px 0 8px", fontSize: 13 }}>{loginError}</p>}
          <button onClick={handleLogin} style={styles.btnPrimary}>ENTRAR</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f1f5f9", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 16px" }}>
        <h1 style={{ fontSize: 24, color: "#002395", fontWeight: 900, margin: "0 0 24px" }}>
          ⚙️ Configuração — Figurita Copa AR
        </h1>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
          {(["config", "check"] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: "8px 20px", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 14,
                background: tab === t ? "#002395" : "#e2e8f0",
                color: tab === t ? "#fff" : "#334155",
              }}
            >
              {t === "config" ? "Configuração" : "Checagem"}
            </button>
          ))}
        </div>

        {tab === "config" && (
          <div style={{ background: "#fff", borderRadius: 16, padding: "28px 24px", boxShadow: "0 4px 20px rgba(0,0,0,.08)" }}>
            <p style={{ margin: "0 0 20px", fontSize: 13, color: "#64748b" }}>
              Edite os valores e clique em Salvar. As mudanças entram em vigor na próxima requisição à home.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {(Object.keys(FIELD_LABELS) as (keyof SiteConfig)[]).map(key => (
                <div key={key}>
                  <label style={{ display: "block", fontWeight: 700, fontSize: 13, color: "#334155", marginBottom: 4 }}>
                    {FIELD_LABELS[key]}
                  </label>
                  <input
                    value={form[key]}
                    onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                    style={{ ...styles.input, marginBottom: 0 }}
                  />
                </div>
              ))}
            </div>

            <div style={{ marginTop: 24, display: "flex", alignItems: "center", gap: 12 }}>
              <button onClick={handleSave} disabled={saving} style={styles.btnPrimary}>
                {saving ? "Salvando..." : "SALVAR CONFIG"}
              </button>
              <button
                onClick={() => { setForm({ ...DEFAULT_CONFIG }); setSaveMsg(null); }}
                style={{ ...styles.btnSecondary }}
              >
                Restaurar padrão
              </button>
              {saveMsg && <span style={{ fontSize: 14, fontWeight: 700 }}>{saveMsg}</span>}
            </div>
          </div>
        )}

        {tab === "check" && (
          <div style={{ background: "#fff", borderRadius: 16, padding: "28px 24px", boxShadow: "0 4px 20px rgba(0,0,0,.08)" }}>
            <p style={{ margin: "0 0 20px", fontSize: 13, color: "#64748b" }}>
              Verifica se os segredos estão configurados no Vercel (não armazena nada, só testa presença).
            </p>
            <button onClick={handleCheck} disabled={checking} style={styles.btnPrimary}>
              {checking ? "Verificando..." : "RODAR CHECAGEM"}
            </button>

            {checkResult && (
              <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 12 }}>
                {(["DATABASE_URL", "BLOB_READ_WRITE_TOKEN", "OPENAI_API_KEY"] as const).map(k => (
                  <div key={k} style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "12px 16px", borderRadius: 10,
                    background: checkResult[k] ? "#f0fdf4" : "#fef2f2",
                    border: `1.5px solid ${checkResult[k] ? "#86efac" : "#fca5a5"}`,
                  }}>
                    <span style={{ fontSize: 20 }}>{checkResult[k] ? "✅" : "❌"}</span>
                    <div>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: checkResult[k] ? "#166534" : "#991b1b" }}>{k}</p>
                      {!checkResult[k] && checkResult.DATABASE_URL_error && k === "DATABASE_URL" && (
                        <p style={{ margin: "2px 0 0", fontSize: 11, color: "#991b1b" }}>{checkResult.DATABASE_URL_error}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  center: {
    minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
    background: "#f1f5f9", fontFamily: "system-ui, sans-serif",
  } as React.CSSProperties,
  loginBox: {
    background: "#fff", borderRadius: 20, padding: "32px 28px",
    boxShadow: "0 20px 60px rgba(0,0,0,.15)", width: 340,
    display: "flex", flexDirection: "column" as const, gap: 4,
  },
  input: {
    width: "100%", boxSizing: "border-box" as const,
    border: "2px solid #e2e8f0", borderRadius: 10, padding: "12px 14px",
    fontSize: 15, outline: "none", color: "#0f172a", fontFamily: "inherit",
    marginBottom: 8,
  },
  btnPrimary: {
    padding: "12px 24px", background: "#002395", color: "#fff",
    border: "none", borderRadius: 10, cursor: "pointer",
    fontWeight: 800, fontSize: 14, letterSpacing: ".06em",
  } as React.CSSProperties,
  btnSecondary: {
    padding: "12px 20px", background: "#f1f5f9", color: "#334155",
    border: "1.5px solid #e2e8f0", borderRadius: 10, cursor: "pointer",
    fontWeight: 700, fontSize: 14,
  } as React.CSSProperties,
};
