import FloatingAvatar from "@/components/floating-avatar";
import ThemeSwitcher from "@/components/theme-switcher";
import { ThemeProvider } from "@/utils/theme-provider";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { Slide, ToastContainer } from "react-toastify";
import "./globals.css";

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
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`${GTAArtDecoMedium.variable} ${GTAArtDecoRegular.variable} antialiased`}
      >
        <FloatingAvatar />
        <ToastContainer
          theme="colored"
          position="top-center"
          transition={Slide}
          autoClose={2000}
          draggable
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ThemeSwitcher />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
