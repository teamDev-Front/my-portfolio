import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Habaeb Creative Solutions | Desenvolvimento Web, SaaS, E-commerce & Automação com IA",
    template: "%s | HCS"
  },
  description: "Desenvolvimento de sites, e-commerces, SaaS, sistemas completos e automação com IA. Soluções digitais sob medida com React, Next.js, Python e mais. Atendemos startups, clínicas, escritórios de advocacia e empresas.",
  keywords: [
    "desenvolvimento web", "criação de sites", "e-commerce", "SaaS",
    "automação com IA", "sistemas web", "landing pages",
    "React", "Next.js", "TypeScript", "Python", "Django",
    "web development", "website creation", "AI automation",
    "soluções digitais", "São Paulo", "Brasil"
  ],
  authors: [{ name: "Luiz Habaeb", url: "https://linkedin.com/in/luizhabaeb" }],
  creator: "Habaeb Creative Solutions",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    alternateLocale: "en_US",
    siteName: "Habaeb Creative Solutions",
    title: "Habaeb Creative Solutions | Soluções Digitais Completas",
    description: "Sites, e-commerces, SaaS, sistemas e automações com IA. Soluções digitais sob medida para seu negócio.",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@luizhabaeb",
    title: "Habaeb Creative Solutions",
    description: "Sites, e-commerces, SaaS, sistemas e automações com IA.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <body className="antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
