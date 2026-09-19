import type { Metadata } from "next";
import { Aref_Ruqaa, Markazi_Text, Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const arefRuqaa = Aref_Ruqaa({
  weight: ["400", "700"],
  subsets: ["arabic"],
  variable: "--font-aref",
});

const markaziText = Markazi_Text({
  weight: ["400", "500", "600", "700"],
  subsets: ["arabic"],
  variable: "--font-markazi",
});

const cormorant = Cormorant_Garamond({
  weight: ["600"],
  style: ["italic"],
  subsets: ["latin"],
  variable: "--font-cormorant",
});

export const metadata: Metadata = {
  title: "رسائل ليلى 💌",
  description: "رسائل يومية لليلى",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${arefRuqaa.variable} ${markaziText.variable} ${cormorant.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('theme');
                  if (saved === 'dark' || saved === 'light') {
                    document.documentElement.setAttribute('data-theme', saved);
                  } else {
                    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}
