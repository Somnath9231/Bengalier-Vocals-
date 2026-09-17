import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bengaliervocals.com"),
  title: "Bengalier Vocals | Music Artist Coordination & Event Production Support",
  description:
    "Bengalier Vocals connects event organizers with singers, musicians, bands, and stage production support in Kolkata and beyond. Professional artist booking for private celebrations, public events, and live concerts.",
  keywords: [
    "Bengalier Vocals",
    "music artist booking",
    "artist coordination",
    "singer booking",
    "live music artist",
    "event music services",
    "concert artist coordination",
    "music event support",
    "sound and stage support",
  ],
  authors: [{ name: "Bengalier Vocals" }],
  openGraph: {
    title: "Bengalier Vocals | Music Artist Coordination & Event Production",
    description:
      "Connecting event organizers with singers, musicians, bands, and stage production support for unforgettable live events.",
    url: "https://bengaliervocals.com",
    siteName: "Bengalier Vocals",
    images: [
      {
        url: "/logo.jpg",
        width: 800,
        height: 800,
        alt: "Bengalier Vocals Logo",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  icons: {
    icon: "/logo.jpg",
    apple: "/logo.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} scroll-smooth antialiased`}>
      <body className="min-h-screen bg-[#FAFAFA] text-[#161616] flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}

