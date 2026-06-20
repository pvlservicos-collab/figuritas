"use client";

import { useState, useRef, useEffect } from "react";

export interface QuizData {
  nome: string;
  dataNascimento: string;
  email: string;
  clube: string;
  jogadorFavorito: string;
  peso: string;
  altura: string;
  foto: File | null;
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

interface QuizStepProps {
  step: number;
  data: QuizData;
  updateData: (fields: Partial<QuizData>) => void;
  onNext: () => void;
  onBack: () => void;
  totalSteps: number;
}

const clubes = [
  // Grandes de Buenos Aires
  "River Plate", "Boca Juniors", "Racing Club", "Independiente", "San Lorenzo",
  "Huracán", "Vélez Sársfield", "Argentinos Juniors", "Ferro Carril Oeste", "Nueva Chicago",
  // Gran Buenos Aires
  "Lanús", "Banfield", "Quilmes", "Lomas de Zamora", "Deportivo Merlo",
  "Defensa y Justicia", "Atlético Tucumán", "Talleres", "Belgrano",
  // Interior
  "Estudiantes", "Gimnasia La Plata", "Platense", "Tigre", "San Martín SJ",
  "Godoy Cruz", "Unión", "Colón", "Rosario Central", "Newell's Old Boys",
  "Instituto", "Atlético Rafaela", "Olimpo", "Tiro Federal",
  // Resto del país
  "Sarmiento", "Aldosivi", "Patronato", "Central Córdoba", "Barracas Central",
  "Arsenal", "Alvarado", "San Martín Tucumán", "Mitre", "Villa Dálmine",
  "Brown Adrogué", "Agropecuario", "Deportivo Riestra", "Flandria",
  "Independiente Rivadavia", "Deportivo Morón", "Temperley", "Los Andes",
  // Selección y otras
  "Selección Argentina", "Otros",
];

export default function QuizStep({ step, data, updateData, onNext, onBack, totalSteps }: QuizStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const [clubeQuery, setClubeQuery] = useState(data.clube || "");
  const [showClubeList, setShowClubeList] = useState(false);
  const clubeRef = useRef<HTMLDivElement>(null);

  // Fecha de nacimiento — campos separados
  const [birthDay, setBirthDay] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthYear, setBirthYear] = useState("");

  const filteredClubes = clubeQuery.trim()
    ? clubes.filter((c) => c.toLowerCase().includes(clubeQuery.toLowerCase()))
    : clubes;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (clubeRef.current && !clubeRef.current.contains(e.target as Node)) setShowClubeList(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const sanitize = (value: string) => value.replace(/<[^>]*>/g, "").replace(/[<>"'&]/g, "");

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};
    switch (step) {
      case 1:
        if (!data.nome || data.nome.trim().length < 2) newErrors.nome = "El nombre debe tener al menos 2 caracteres";
        if (data.nome.length > 50) newErrors.nome = "Nombre demasiado largo";
        if (!data.foto) newErrors.foto = "Por favor enviá la foto del crack";
        break;
      case 2:
        if (!data.dataNascimento) newErrors.dataNascimento = "Por favor indicá la fecha de nacimiento";
        else {
          const birth = new Date(data.dataNascimento);
          const now = new Date();
          const age = now.getFullYear() - birth.getFullYear();
          if (age < 0 || age > 120) newErrors.dataNascimento = "Fecha inválida";
        }
        if (!data.email || !isValidEmail(data.email)) newErrors.email = "Ingresá un correo electrónico válido";
        break;
      case 3:
        if (!data.clube || data.clube.trim().length < 2) newErrors.clube = "Escribí o seleccioná un club";
        break;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) onNext();
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setErrors({ foto: "Por favor enviá solo imágenes" }); return; }
    if (file.size > 10 * 1024 * 1024) { setErrors({ foto: "Imagen demasiado grande (máx. 10 MB)" }); return; }
    updateData({ foto: file });
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
    setErrors((prev) => { const next = { ...prev }; delete next.foto; return next; });
  };

  const progressPercent = (step / totalSteps) * 100;

  return (
    <section className="flex flex-col items-center min-h-[100dvh] w-full px-4 py-8 md:py-16" style={{ background: "#74ACDF" }}>
      {/* Progress bar */}
      <div className="w-full max-w-md mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-bold" style={{ fontFamily: "var(--font-papernotes)" }}>
            Paso {step} de {totalSteps}
          </span>
          <span className="text-sm" style={{ fontFamily: "var(--font-papernotes)" }}>
            {Math.round(progressPercent)}%
          </span>
        </div>
        <div className="w-full h-3 bg-copa-white rounded-full overflow-hidden shadow-inner">
          <div className="h-full bg-copa-blue rounded-full transition-all duration-500 ease-out" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      {/* Card container */}
      <div className="w-full max-w-md bg-copa-white rounded-3xl shadow-2xl p-6 md:p-8 animate-slide-up">

        {/* Step 1: Nombre + Foto */}
        {step === 1 && (
          <div className="flex flex-col gap-5">
            <div className="text-center">
              <span className="text-4xl mb-2 block">✍️</span>
              <h2 className="text-2xl md:text-3xl font-black text-copa-blue" style={{ fontFamily: "var(--font-titulo)" }}>
                ¿CÓMO SE LLAMA EL CRACK?
              </h2>
              <p className="text-base mt-1 opacity-70" style={{ fontFamily: "var(--font-papernotes)" }}>
                El nombre que va a aparecer en la figurita
              </p>
            </div>
            <div>
              <input
                type="text"
                value={data.nome}
                onChange={(e) => updateData({ nome: sanitize(e.target.value) })}
                placeholder="Nombre y apellido"
                maxLength={50}
                autoComplete="name"
                className="w-full px-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-copa-blue focus:outline-none transition-colors placeholder:text-gray-400"
                style={{ fontFamily: "var(--font-papernotes)" }}
              />
              {errors.nome && <p className="text-red-500 text-sm mt-1">{errors.nome}</p>}
            </div>

            <div>
              <label className="block text-lg font-bold mb-2 text-copa-blue" style={{ fontFamily: "var(--font-titulo)", letterSpacing: "0.15em" }}>
                FOTO DEL CRACK
              </label>
              {photoPreview ? (
                <div onClick={() => fileInputRef.current?.click()} className="border-2 border-copa-blue rounded-xl p-4 text-center cursor-pointer hover:opacity-90 transition-opacity">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photoPreview} alt="Preview" className="w-28 h-28 rounded-full mx-auto object-cover border-4 border-copa-blue" />
                  <p className="text-xs mt-2 text-copa-blue font-bold" style={{ fontFamily: "var(--font-papernotes)" }}>Tocá para cambiar la foto</p>
                </div>
              ) : (
                <div className="flex gap-3">
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="flex-1 border-2 border-dashed border-gray-300 rounded-xl p-5 text-center cursor-pointer hover:border-copa-blue transition-colors">
                    <span className="text-3xl block mb-1">🖼️</span>
                    <p className="text-sm font-bold" style={{ fontFamily: "var(--font-titulo)", letterSpacing: "0.15em" }}>Galería</p>
                  </button>
                  <button type="button" onClick={() => cameraInputRef.current?.click()} className="flex-1 border-2 border-dashed border-gray-300 rounded-xl p-5 text-center cursor-pointer hover:border-copa-blue transition-colors">
                    <span className="text-3xl block mb-1">📸</span>
                    <p className="text-sm font-bold" style={{ fontFamily: "var(--font-titulo)", letterSpacing: "0.15em" }}>Cámara</p>
                  </button>
                </div>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
              <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={handlePhotoChange} className="hidden" />
              {errors.foto && <p className="text-red-500 text-sm mt-1">{errors.foto}</p>}
            </div>
          </div>
        )}

        {/* Step 2: Fecha de nacimiento */}
        {step === 2 && (
          <div className="flex flex-col gap-5">
            <div className="text-center">
              <span className="text-4xl mb-2 block">🎂</span>
              <h2 className="text-2xl md:text-3xl font-black text-copa-blue" style={{ fontFamily: "var(--font-titulo)" }}>
                FECHA DE NACIMIENTO
              </h2>
              <p className="text-base mt-1 opacity-70" style={{ fontFamily: "var(--font-papernotes)" }}>
                Para calcular la edad en la figurita
              </p>
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-base font-bold mb-1 text-copa-blue" style={{ fontFamily: "Arial, sans-serif" }}>DÍA</label>
                <select
                  value={birthDay}
                  onChange={(e) => {
                    setBirthDay(e.target.value);
                    if (e.target.value && birthMonth && birthYear) {
                      updateData({ dataNascimento: `${birthYear}-${birthMonth}-${e.target.value}` });
                    }
                  }}
                  className="w-full px-3 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-copa-blue focus:outline-none transition-colors bg-white cursor-pointer"
                  style={{ fontFamily: "var(--font-papernotes)" }}
                >
                  <option value="">--</option>
                  {Array.from({ length: 31 }, (_, i) => (
                    <option key={i + 1} value={String(i + 1).padStart(2, "0")}>{i + 1}</option>
                  ))}
                </select>
              </div>
              <div className="flex-[1.3]">
                <label className="block text-base font-bold mb-1 text-copa-blue" style={{ fontFamily: "Arial, sans-serif" }}>MES</label>
                <select
                  value={birthMonth}
                  onChange={(e) => {
                    setBirthMonth(e.target.value);
                    if (birthDay && e.target.value && birthYear) {
                      updateData({ dataNascimento: `${birthYear}-${e.target.value}-${birthDay}` });
                    }
                  }}
                  className="w-full px-3 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-copa-blue focus:outline-none transition-colors bg-white cursor-pointer"
                  style={{ fontFamily: "var(--font-papernotes)" }}
                >
                  <option value="">--</option>
                  {["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"].map((m, i) => (
                    <option key={i} value={String(i + 1).padStart(2, "0")}>{m}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-base font-bold mb-1 text-copa-blue" style={{ fontFamily: "Arial, sans-serif" }}>AÑO</label>
                <select
                  value={birthYear}
                  onChange={(e) => {
                    setBirthYear(e.target.value);
                    if (birthDay && birthMonth && e.target.value) {
                      updateData({ dataNascimento: `${e.target.value}-${birthMonth}-${birthDay}` });
                    }
                  }}
                  className="w-full px-3 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-copa-blue focus:outline-none transition-colors bg-white cursor-pointer"
                  style={{ fontFamily: "var(--font-papernotes)" }}
                >
                  <option value="">--</option>
                  {Array.from({ length: new Date().getFullYear() - 1920 + 1 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                    <option key={y} value={String(y)}>{y}</option>
                  ))}
                </select>
              </div>
            </div>
            {errors.dataNascimento && <p className="text-red-500 text-sm mt-1">{errors.dataNascimento}</p>}

            {/* Email */}
            <div>
              <label className="block text-lg font-bold mb-1 text-copa-blue" style={{ fontFamily: "var(--font-titulo)" }}>
                TU EMAIL
              </label>
              <input
                type="email"
                value={data.email}
                onChange={(e) => updateData({ email: e.target.value.trim() })}
                placeholder="ejemplo@correo.com"
                maxLength={255}
                autoComplete="email"
                className="w-full px-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-copa-blue focus:outline-none transition-colors placeholder:text-gray-400"
                style={{ fontFamily: "var(--font-papernotes)" }}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
          </div>
        )}

        {/* Step 3: Club */}
        {step === 3 && (
          <div className="flex flex-col gap-5">
            <div className="text-center">
              <span className="text-4xl mb-2 block">⭐</span>
              <h2 className="text-2xl md:text-3xl font-black text-copa-blue" style={{ fontFamily: "var(--font-titulo)" }}>
                CLUB Y DATOS
              </h2>
              <p className="text-base mt-1 opacity-70" style={{ fontFamily: "var(--font-papernotes)" }}>
                El club del corazón y los datos para la figurita
              </p>
            </div>

            {/* Peso y Altura */}
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-lg font-bold mb-1 text-copa-blue" style={{ fontFamily: "var(--font-titulo)" }}>
                  PESO (kg)
                </label>
                <input
                  type="number"
                  value={data.peso}
                  onChange={(e) => updateData({ peso: e.target.value })}
                  placeholder="Ej: 70"
                  min={1} max={300}
                  className="w-full px-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-copa-blue focus:outline-none transition-colors placeholder:text-gray-400"
                  style={{ fontFamily: "var(--font-papernotes)" }}
                />
              </div>
              <div className="flex-1">
                <label className="block text-lg font-bold mb-1 text-copa-blue" style={{ fontFamily: "var(--font-titulo)" }}>
                  ALTURA (cm)
                </label>
                <input
                  type="number"
                  value={data.altura}
                  onChange={(e) => updateData({ altura: e.target.value })}
                  placeholder="Ej: 175"
                  min={1} max={300}
                  className="w-full px-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-copa-blue focus:outline-none transition-colors placeholder:text-gray-400"
                  style={{ fontFamily: "var(--font-papernotes)" }}
                />
              </div>
            </div>

            {/* Club */}
            <div ref={clubeRef} className="relative">
              <label className="block text-lg font-bold mb-1 text-copa-blue" style={{ fontFamily: "var(--font-titulo)" }}>
                CLUB DEL CORAZÓN
              </label>
              <input
                type="text"
                value={clubeQuery}
                onChange={(e) => { const v = sanitize(e.target.value); setClubeQuery(v); updateData({ clube: v }); setShowClubeList(true); }}
                onFocus={() => setShowClubeList(true)}
                placeholder="Escribí el nombre del club..."
                maxLength={50}
                className="w-full px-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-copa-blue focus:outline-none transition-colors placeholder:text-gray-400"
                style={{ fontFamily: "var(--font-papernotes)" }}
              />
              {showClubeList && (
                <div className="absolute z-50 w-full mt-1 bg-white border-2 border-gray-200 rounded-xl shadow-lg max-h-40 overflow-y-auto">
                  {filteredClubes.length > 0 ? filteredClubes.slice(0, 8).map((c) => (
                    <button key={c} type="button"
                      onClick={() => { setClubeQuery(c); updateData({ clube: c }); setShowClubeList(false); }}
                      className={`w-full text-left px-4 py-3 hover:bg-copa-yellow/30 transition-colors cursor-pointer ${data.clube === c ? "bg-copa-blue/10 font-bold text-copa-blue" : "text-gray-700"} first:rounded-t-xl last:rounded-b-xl`}
                      style={{ fontFamily: "var(--font-papernotes)" }}
                    >{c}</button>
                  )) : (
                    <div className="px-4 py-3 text-center" style={{ fontFamily: "var(--font-papernotes)" }}>
                      <p className="font-bold text-copa-blue">Club personalizado</p>
                      <p className="text-sm text-gray-500">Vamos a usar &ldquo;{clubeQuery}&rdquo;</p>
                    </div>
                  )}
                </div>
              )}
              {errors.clube && <p className="text-red-500 text-sm mt-1">{errors.clube}</p>}
            </div>
          </div>
        )}

        {/* Privacy notice — step 1 only */}
        {step === 1 && (
          <p className="text-center text-xs text-gray-400 mt-6" style={{ fontFamily: "var(--font-papernotes)" }}>
            Al enviar aceptás nuestra{" "}
            <span className="underline hover:text-gray-600 transition-colors cursor-default">
              política de privacidad
            </span>
          </p>
        )}

        {/* Navigation buttons */}
        <div className="flex gap-3 mt-4">
          {step > 1 && (
            <button onClick={onBack}
              className="flex-1 px-6 py-4 rounded-xl border-2 border-copa-blue text-copa-blue font-bold hover:bg-copa-blue hover:text-copa-white transition-all duration-200 cursor-pointer tracking-[0.15em]"
              style={{ fontFamily: "var(--font-titulo)" }}
            >VOLVER</button>
          )}
          <button onClick={handleNext}
            className="flex-1 bg-copa-blue text-copa-white font-bold text-lg px-6 py-4 rounded-xl shadow-lg hover:bg-copa-blue-hover active:scale-95 transition-all duration-200 cursor-pointer tracking-[0.15em]"
            style={{ fontFamily: "var(--font-titulo)" }}
          >
            {step === totalSteps ? "GENERAR FIGURITA ⚽" : "SIGUIENTE →"}
          </button>
        </div>
      </div>

      {/* Step indicators */}
      <div className="flex gap-2 mt-6">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div key={i} className={`w-3 h-3 rounded-full transition-all duration-300 ${i + 1 <= step ? "bg-copa-blue scale-110" : "bg-copa-white opacity-50"}`} />
        ))}
      </div>
    </section>
  );
}
