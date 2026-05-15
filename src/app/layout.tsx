import type { Metadata } from "next";
import { userData } from "@/helpers/userdata";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL(userData.siteUrl),
  title: {
    default: `${userData.profileName} - Software Engineer Portfolio`,
    template: `%s | ${userData.profileName}`,
  },
  description: `Portfolio of ${userData.profileName} — Full Stack Software Engineer specializing in web development, automation, and modern JavaScript/TypeScript ecosystems.`,
  keywords: [
    "Portfolio",
    userData.profileName,
    "Software Engineer",
    "Full Stack Developer",
    "Web Development",
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "GitHub",
  ],
  authors: [{ name: userData.profileName, url: userData.contact.github.url }],
  creator: userData.profileName,
  publisher: userData.profileName,
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
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: userData.siteUrl,
    siteName: `${userData.profileName} - Portfolio`,
    title: `${userData.profileName} - Software Engineer Portfolio`,
    description: `Portfolio of ${userData.profileName} — Full Stack Software Engineer specializing in web development, automation, and modern JavaScript/TypeScript ecosystems.`,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${userData.profileName} - Software Engineer Portfolio`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${userData.profileName} - Software Engineer Portfolio`,
    description: `Portfolio of ${userData.profileName} — Full Stack Software Engineer specializing in web development, automation, and modern JavaScript/TypeScript ecosystems.`,
    creator: `@${userData.username}`,
    images: [
      {
        url: "/twitter-image",
        width: 1200,
        height: 600,
        alt: `${userData.profileName} - Software Engineer Portfolio`,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
