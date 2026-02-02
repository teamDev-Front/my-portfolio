import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Habaeb Creative Solutions | Web Development & Digital Solutions",
    template: "%s | HCS"
  },
  description: "Website creation, e-commerce, SaaS, systems and AI automation. Digital solutions for law firms, real estate, clinics and businesses.",
  keywords: ["web development", "website creation", "e-commerce", "SaaS", "AI automation", "corporate websites", "criação de sites", "desenvolvimento web"],
  authors: [{ name: "Luiz Habaeb", url: "https://linkedin.com/in/luizhabaeb" }],
  creator: "Habaeb Creative Solutions",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    alternateLocale: "en_US",
    siteName: "Habaeb Creative Solutions",
  },
  twitter: {
    card: "summary_large_image",
    creator: "@luizhabaeb",
  },
  robots: {
    index: true,
    follow: true,
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
      </body>
    </html>
  );
}
