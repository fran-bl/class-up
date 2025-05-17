import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/utils/ThemeProvider";
import ToastProvider from "@/utils/ToastProvider";

export const metadata: Metadata = {
  title: "ClassUp",
};

const GTAArtDecoMedium = localFont({
  src: '../fonts/GTA Art Deco - Medium.ttf',
  variable: '--font-gta-medium',
  display: 'swap',
});

const GTAArtDecoRegular = localFont({
  src: '../fonts/GTA Art Deco - Regular.ttf',
  variable: '--font-gta-regular',
  display: 'swap',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${GTAArtDecoMedium.variable} ${GTAArtDecoRegular.variable} antialiased`}
      >
        <ToastProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
