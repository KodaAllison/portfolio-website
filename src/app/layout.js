import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

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

export const metadata = {
  metadataBase: new URL("https://koda-allison-portfolio.vercel.app"),
  title: "Koda Allison | Web Developer & Computer Science Graduate",
  description:
    "First Class Computer Science Graduate with a passion for web development and a keen interest in fitness. Proficient in TypeScript, JavaScript, Tailwind CSS, and Git. Technical Graduate with Virgin Money.",
  keywords: [
    "Koda Allison",
    "Web Developer",
    "Software Developer",
    "Computer Science Graduate",
    "TypeScript",
    "JavaScript",
    "React",
    "Next.js",
    "Tailwind CSS",
    "Portfolio",
    "Full Stack Developer",
    "Virgin Money",
  ],
  authors: [{ name: "Koda Allison" }],
  creator: "Koda Allison",
  publisher: "Koda Allison",
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
    url: "https://koda-allison-portfolio.vercel.app",
    siteName: "Koda Allison Portfolio",
    title: "Koda Allison | Web Developer & Computer Science Graduate",
    description:
      "First Class Computer Science Graduate with a passion for web development and a keen interest in fitness. Proficient in TypeScript, JavaScript, Tailwind CSS, and Git.",
    images: [
      {
        url: "/profilePhoto.jpg",
        width: 1200,
        height: 630,
        alt: "Koda Allison - Web Developer & Computer Science Graduate",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Koda Allison | Web Developer & Computer Science Graduate",
    description:
      "First Class Computer Science Graduate with a passion for web development and a keen interest in fitness.",
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
