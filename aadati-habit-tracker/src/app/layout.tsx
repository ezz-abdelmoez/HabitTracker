import type { Metadata, Viewport } from "next";
import "@fontsource-variable/cairo";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/700.css";
import "./globals.css";
import { QueryProvider } from "@/lib/query-client";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { siteConfig } from "@/lib/site-config";
import { MainNav } from "@/components/shared/main-nav";

export const metadata: Metadata = {
  metadataBase: new URL("https://aadati.example.com"),
  title: { default: siteConfig.name, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
  openGraph: { title: siteConfig.name, description: siteConfig.description, url: siteConfig.url, siteName: siteConfig.name, locale: "ar_EG", type: "website" },
  twitter: { card: "summary", title: siteConfig.name, description: siteConfig.description },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [{ media: "(prefers-color-scheme: light)", color: "#f7faf9" }, { media: "(prefers-color-scheme: dark)", color: "#10201e" }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground" suppressHydrationWarning>
        <a href="#main-content" className="skip-link">تخطَّ إلى المحتوى</a>
        <QueryProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <MainNav />
            <div className="flex-1">{children}</div>
            <Toaster position="top-center" richColors closeButton />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
