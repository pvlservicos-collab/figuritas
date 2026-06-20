import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tu Figurita Panini del Mundial 2026 | Creá la tuya",
  description:
    "¡Creá tu figurita Panini personalizada del Mundial 2026! Tu foto con el estilo de los campeones. Archivo digital.",
  robots: "index, follow",
  openGraph: {
    title: "Tu Figurita Panini del Mundial 2026",
    description: "¡Creá tu figurita Panini personalizada del Mundial 2026!",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-AR" className="h-full antialiased">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdn.utmify.com.br" />
        <link href="https://fonts.googleapis.com/css2?family=Anton&family=Oswald:wght@400;500;600;700&display=swap" rel="stylesheet" />
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script dangerouslySetInnerHTML={{ __html: `window.pixelId = "6a1915dda9b3c3e00a76276a"; var a = document.createElement("script"); a.setAttribute("async", ""); a.setAttribute("defer", ""); a.setAttribute("src", "https://cdn.utmify.com.br/scripts/pixel/pixel.js"); document.head.appendChild(a);` }} />
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script type="text/javascript" src="https://assets.mycartpanda.com/cartx-ecomm-ui-assets/js/cpsales.js"></script>
      </head>
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
