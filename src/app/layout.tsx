import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";

export const metadata: Metadata = {
  title: "AxiomProof | Deterministic Academic Verification & Viva-Voce Defense Engine",
  description:
    "Deterministic manuscript structural alignment, anti-ghostwriting literature synthesis, and oral defense panel simulation for academic researchers and thesis candidates.",
};

export const viewport: Viewport = {
  themeColor: "#8b718e",
  width: "device-width",
  initialScale: 1,
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
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const storedTheme = localStorage.getItem('axiomproof_theme') || localStorage.getItem('scholarflow_theme');
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="antialiased min-h-screen bg-background text-foreground transition-colors duration-200 selection:bg-primary/20 selection:text-primary">
        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              borderRadius: "9999px",
              background: "var(--background)",
              color: "var(--text)",
              border: "1px solid var(--elev-border)",
            },
          }}
        />
      </body>
    </html>
  );
}
