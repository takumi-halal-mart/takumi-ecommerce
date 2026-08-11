export const BASE_URL = "https://www.takumihalalmart.store";
export const SITE_NAME = "Takumi Halal Mart";
export const DEFAULT_OG_IMAGE = `${BASE_URL}/og-default.png`; // create this image: 1200x630, brand look

export const DEFAULT_METADATA = {
  metadataBase: new URL(BASE_URL),
  applicationName: SITE_NAME,
  authors: [{ name: "Takumi Halal Mart", url: BASE_URL }],
  creator: "Takumi Halal Mart",
  publisher: "Takumi Halal Mart",
  formatDetection: { email: false, address: false, telephone: false },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large" as const,
      "max-snippet": -1,
    },
  },
};
