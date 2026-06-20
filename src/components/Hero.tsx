"use client";

import Image from "next/image";

interface HeroProps {
  onStart: () => void;
  ctaText?: string;
}

export default function Hero({ onStart, ctaText = "CREAR MI FIGURITA" }: HeroProps) {
  return (
    <section className="flex flex-col items-center min-h-[100dvh] w-full px-5 pt-8 pb-4 text-center overflow-x-hidden justify-center gap-3 md:gap-2 md:py-6" style={{ background: "#74ACDF", position: "relative" }}>
      <a href="/ver-preco" style={{ position: "absolute", top: 10, right: 12, fontSize: 10, color: "rgba(0,0,0,0.25)", textDecoration: "none", fontFamily: "monospace" }}>💲 preço</a>
      <h1
        className="text-[1.9rem] sm:text-[2.85rem] md:text-[3.42rem] lg:text-[3.42rem] font-normal leading-[1.32] mb-1 w-full max-w-2xl"
        style={{ fontFamily: "var(--font-titulo)" }}
      >
        Convertí a tu hijo en una{" "}
        <span style={{ color: "#003087" }}>figurita personalizada</span> del Mundial
      </h1>

      <div className="relative w-[260px] h-[260px] sm:w-80 sm:h-80 md:w-96 md:h-[340px] mb-2 md:mb-10 -mt-4 md:-mt-3">
        <div
          className="absolute left-0 top-14 md:top-16 w-36 h-52 md:w-48 md:h-72 rounded-xl overflow-hidden shadow-md z-10"
          style={{
            transform: "rotate(-8deg) translateZ(0)",
            animation: "wiggle 14s ease-in-out infinite",
            willChange: "transform",
            backfaceVisibility: "hidden",
          }}
        >
          <div className="relative w-full h-full">
            <Image
              src="/olivia.webp"
              alt="Figurita Helena"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 144px, 192px"
              priority
            />
            <div className="absolute inset-0 shine-effect" />
          </div>
        </div>

        <div
          className="absolute left-[58%] -translate-x-1/2 top-8 w-44 h-64 md:w-60 md:h-[340px] rounded-xl overflow-hidden shadow-md z-30"
          style={{
            transform: "translateZ(0)",
            animation: "wiggle-center 14s ease-in-out infinite 0.5s",
            willChange: "transform",
            backfaceVisibility: "hidden",
          }}
        >
          <div className="relative w-full h-full">
            <Image
              src="/mateo.webp"
              alt="Figurita Arthur"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 176px, 240px"
              priority
            />
            <div className="absolute inset-0 shine-effect" style={{ animationDelay: "1s" }} />
          </div>
        </div>

        <div
          className="absolute right-0 top-14 md:top-16 w-36 h-52 md:w-48 md:h-72 rounded-xl overflow-hidden shadow-md z-10"
          style={{
            transform: "rotate(8deg) translateZ(0)",
            animation: "wiggle-down 14s ease-in-out infinite 1s",
            willChange: "transform",
            backfaceVisibility: "hidden",
          }}
        >
          <div className="relative w-full h-full">
            <Image
              src="/olivia.webp"
              alt="Figurita Helena"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 144px, 192px"
              priority
            />
            <div className="absolute inset-0 shine-effect" style={{ animationDelay: "2s" }} />
          </div>
        </div>
      </div>

      <p
        className="text-lg md:text-xl max-w-md mb-5 leading-[1.2] md:leading-relaxed mt-8 md:mt-5"
        style={{ fontFamily: "var(--font-papernotes)" }}
      >
        Respondé unas preguntas rápidas y generá en segundos la figurita del Mundial de tu pequeño campeón.
      </p>

      <button
        onClick={onStart}
        className="w-full max-w-md bg-copa-blue text-copa-white font-bold text-2xl md:text-3xl py-5 rounded-2xl
          shadow-lg hover:bg-copa-blue-hover active:scale-95 transition-all duration-200
          cursor-pointer tracking-[0.15em]"
        style={{ fontFamily: "var(--font-titulo)" }}
      >
        {ctaText}
      </button>

      <div className="mt-2 flex flex-col items-center gap-2">
        <div className="flex items-center gap-1">
          {[
            { code: "ar", label: "Argentina", big: true },
            { code: "br", label: "Brasil", big: false },
            { code: "fr", label: "Francia", big: false },
            { code: "de", label: "Alemania", big: false },
            { code: "es", label: "España", big: false },
          ].map(({ code, label, big }) => (
            <img
              key={code}
              src={`https://flagcdn.com/w${big ? "80" : "40"}/${code}.png`}
              alt={label}
              width={big ? 44 : 32}
              height={big ? 30 : 21}
              className={`rounded shadow-md border border-gray-200 ${big ? "" : "opacity-80"}`}
              style={{ transition: "transform 0.2s" }}
            />
          ))}
        </div>
        <p className="text-sm font-bold" style={{ fontFamily: "var(--font-papernotes)" }}>
          +2.500 figuritas ya creadas!
        </p>
      </div>

    </section>
  );
}
