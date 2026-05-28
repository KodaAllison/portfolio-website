import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import about from "../data/about.json";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const siteUrl = `https://${about.domain}`;
const title = `${about.name} | ${about.role} & computer science graduate`;
const description = `${about.education.result} computer science graduate and ${about.title} at ${about.employer.label}. ${about.bio} Proficient in ${about.stack.join(", ")}.`;

export const metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  keywords: [
    about.name,
    "web developer",
    "software developer",
    "computer science graduate",
    ...about.stack,
    "portfolio",
    "full stack developer",
    about.employer.label,
  ],
  authors: [{ name: about.name }],
  creator: about.name,
  publisher: about.name,
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
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: siteUrl,
    siteName: `${about.name} portfolio`,
    title,
    description,
    images: [
      {
        url: "/profilePhoto.jpg",
        width: 1200,
        height: 630,
        alt: `${about.name} — ${about.role} & computer science graduate`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/profilePhoto.jpg"],
    creator: "@kodallison",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body className="font-mono bg-background text-on-surface antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
