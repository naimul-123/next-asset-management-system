
"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./globals.css";
import Header from "../components/header/Header";
import { useState } from "react";
import { AuthProvider } from "../contexts/authContext";
import { AssetProvider } from "../contexts/assetContext";
import Navbar from "../components/header/Navbar";





export default function RootLayout({
  children,
}) {

  const [queryClient] = useState(() => new QueryClient());

  return (
    <html lang="en">
      <body>

        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <AssetProvider>
              <main className="bg-[#e6f4ed] text-[#007f40] min-h-screen ">

                <Header />
                <Navbar />
                <div className="mx-auto px-4 h-[calc(100vh-220px)]" >
                  {children}
                </div>
                <footer >
                </footer>

              </main>
            </AssetProvider>
          </AuthProvider>
        </QueryClientProvider>

      </body>
    </html>
  );
}
