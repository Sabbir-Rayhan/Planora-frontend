import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Providers from "@/components/shared/Providers";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/shared/ThemeProvider";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Planora — Event Management Platform",
  description: "Create, manage and join events easily",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={geist.className}>
        <ThemeProvider>
          <Providers>
            {children}
            <Toaster position="top-right" />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}