// page.js is a client component, so route metadata lives in this layout.
export const metadata = {
  title: "Contact | Koda Allison",
  description:
    "Get in touch — grab my email, or find me on GitHub, LinkedIn, and Strava.",
  alternates: { canonical: "/contact" },
};

export default function ContactLayout({ children }) {
  return children;
}
