import { Inter } from "next/font/google";
import { Analytics } from '@vercel/analytics/react';
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Koda Allison | Web Developer & Computer Science Graduate",
  description: "First Class Computer Science Graduate with a passion for web development and a keen interest in fitness. Proficient in TypeScript, JavaScript, Tailwind CSS, and Git. Technical Graduate with Virgin Money.",
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
    "Virgin Money"
  ],
  authors: [{ name: "Koda Allison" }],
  creator: "Koda Allison",
  publisher: "Koda Allison",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
