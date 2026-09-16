import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import TopAppBar from "@/components/TopAppBar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "History by Immersion — Chronos Archive",
  description: "Train pattern-recognition and probabilistic thinking using historical scenarios.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-parchment-base text-on-surface min-h-screen flex selection:bg-cobalt-accent selection:text-white font-[Inter,sans-serif]">
        <Sidebar />
        <div className="flex-1 ml-64 flex flex-col min-h-screen">
          <TopAppBar />
          <main className="flex-1 pt-24 pb-section-padding px-gutter md:px-stack-lg max-w-container-max-width mx-auto w-full">
            {children}
          </main>
          <footer className="w-full mt-stack-lg border-t border-subtle bg-parchment-base/50 flex flex-col items-center gap-6 py-10 px-gutter mt-auto">
            <div className="flex flex-col items-center justify-center gap-2">
              <span className="material-symbols-outlined text-cobalt-accent text-[24px]">hourglass_bottom</span>
              <div className="font-ui-label-bold text-[12px] uppercase tracking-[0.2em] text-primary">
                © 2026 Chronos Archive
              </div>
              <p className="font-ui-label-sm text-[11px] text-on-surface-variant tracking-wider">
                Intellectual Clarity through Historical Gravity.
              </p>
            </div>
            
            <div className="w-full max-w-md h-px bg-gradient-to-r from-transparent via-subtle to-transparent"></div>
            
            <ul className="flex flex-wrap justify-center gap-x-8 gap-y-3 font-ui-label-sm text-[12px] text-on-tertiary-container">
              <li><a href="#" className="hover:text-cobalt-accent transition-colors">Methodology</a></li>
              <li><a href="#" className="hover:text-cobalt-accent transition-colors">Source Standards</a></li>
              <li><a href="#" className="hover:text-cobalt-accent transition-colors">Ethical Framework</a></li>
              <li><a href="#" className="hover:text-cobalt-accent transition-colors">Contact Curator</a></li>
            </ul>
          </footer>
        </div>
      </body>
    </html>
  );
}
