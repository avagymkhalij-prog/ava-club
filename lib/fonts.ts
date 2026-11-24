import localFont from "next/font/local";

// Vazirmatn variable font, loaded locally for best performance & offline dev.
// Requires app/fonts/Vazirmatn[wght].woff2 (variable weight 100-900).
export const vazirmatn = localFont({
  src: "../app/fonts/Vazirmatn[wght].woff2",
  variable: "--font-vazirmatn",
  weight: "100 900",
  display: "swap",
  preload: true,
});
