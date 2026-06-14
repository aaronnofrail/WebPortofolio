import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "aaronnofrail.sys | Retro Portfolio",
  description: "Computer Science specialist passionate about engineering secure, scalable, and lightweight backend architectures.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col relative bg-background text-primary selection:bg-primary selection:text-on-primary">
        <div className="crt-overlay"></div>
        {children}
      </body>
    </html>
  );
}
