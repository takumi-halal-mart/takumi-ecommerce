import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { DEFAULT_METADATA, SITE_NAME, BASE_URL, DEFAULT_OG_IMAGE } from "@/utils/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  ...DEFAULT_METADATA,
  title: {
    default: `${SITE_NAME} | Japan's Premier Halal Grocery Store`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Takumi Halal Mart in Chiba, Japan — 100% halal certified meats, fresh Sri Lankan produce, authentic spices, and daily essentials. Retail and wholesale available. Delivery across Japan.",
  keywords: [
    "halal grocery Japan",
    "halal meat Chiba",
    "Sri Lankan food Japan",
    "halal supermarket Japan",
    "Muslim grocery Japan",
    "halal food online Japan",
    "チバ ハラール",
    "ハラール食品 日本",
    "タクミ ハラール",
    "wholesale halal Japan",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["ja_JP"],
    url: BASE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Japan's Premier Halal Grocery Store`,
    description:
      "100% halal certified meats, fresh Sri Lankan produce, spices and essentials. Shop online or visit us in Chiba, Japan.",
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Takumi Halal Mart — Japan's Premier Halal Grocery Store",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Japan's Premier Halal Grocery Store`,
    description:
      "100% halal certified meats, fresh Sri Lankan produce, spices and essentials delivered across Japan.",
    images: [DEFAULT_OG_IMAGE],
  },
  alternates: {
    languages: {
      "en": "https://www.takumihalalmart.store",
      "ja": "https://www.takumihalalmart.store",
    },
  },
  verification: {
    google: "YOUR_GOOGLE_VERIFICATION_CODE", // from Search Console
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
