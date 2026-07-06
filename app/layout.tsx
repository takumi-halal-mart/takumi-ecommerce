import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://takumi.com"), // Placeholder URL, replace with actual production URL
  title: {
    template: "%s | Takumi",
    default: "Takumi | Premium Wholesale & Retail E-Commerce",
  },
  description: "Discover premium quality products at Takumi. Your trusted marketplace for wholesale and retail, offering the best prices and high-velocity catalog.",
  keywords: ["ecommerce", "wholesale", "retail", "marketplace", "premium products", "Takumi", "online shopping"],
  authors: [{ name: "Takumi E-Commerce" }],
  creator: "Takumi",
  publisher: "Takumi Marketplace",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Takumi | Premium Wholesale & Retail E-Commerce",
    description: "Discover premium quality products at Takumi. Your trusted marketplace for wholesale and retail.",
    url: "https://takumi.com",
    siteName: "Takumi",
    images: [
      {
        url: "/takumi_white.png",
        width: 1200,
        height: 630,
        alt: "Takumi E-Commerce Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Takumi | Premium Wholesale & Retail E-Commerce",
    description: "Discover premium quality products at Takumi. Your trusted marketplace for wholesale and retail.",
    images: ["/takumi_white.png"],
    creator: "@TakumiMarket",
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
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
