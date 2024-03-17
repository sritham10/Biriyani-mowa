import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import AppProvider from "@/components/AppContext.js";
import { Toaster } from "react-hot-toast";

const roboto = Roboto({ subsets: ["latin"], weight: ['400', '500', '700'] });

export const metadata: Metadata = {
  title: "Biryani Mowa Official - Authentic Biryani Experience",
  description: "Indulge in the exquisite world of biryanis with Biryani Mowa. We bring you a culinary journey filled with rich flavors, aromatic spices, and the finest ingredients. Savor the essence of tradition in every bite.",
  icons: {
    icon: './BRAND_LOGO.jpg'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={roboto.className} style={{backgroundColor: '#f7e9da'}}>
        <main className="max-w-5xl mx-auto p-4">
          <AppProvider>
            <Toaster />
            <Header />
            {children}
            <footer className="border-t border-slate-400 p-8 text-center text-slate-500 mt-16">
              &copy; {new Date().getFullYear()}
            </footer>
          </AppProvider>
        </main>
      </body>
    </html>
  );
}
