import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { Footer } from "@/components/sections/Footer";
import { Header } from "@/components/sections/Header";
import { site } from "@/data/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: `${site.name} · ${site.tagline}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  openGraph: { type: "website", locale: "id_ID", siteName: site.name },
};

export default function RootLayout({ children, modal }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${inter.variable} ${jakarta.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <body className="flex min-h-dvh flex-col">
        <a
          href="#konten"
          className="sr-only rounded-pill bg-accent-bg font-medium text-sm text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-4 focus:z-60 focus:px-5 focus:py-3"
        >
          Lewati ke konten
        </a>
        <ThemeProvider attribute="data-theme" defaultTheme="dark" enableSystem={false}>
          <Header />
          {children}
          <Footer />
          {modal}
        </ThemeProvider>
        <SmoothScroll />
      </body>
    </html>
  );
}
