"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from 'next-auth/react';
import "./globals.css";
import Header from "../components/Header";
import { useState } from "react";
export default function RootLayout({ children, session }) {

  const [queryClient] = useState(() => new QueryClient());
  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <SessionProvider>
            <div className="flex flex-col h-screen  max-w-screen-2xl mx-auto text-dark  print:h-fit">
              <Header />
              <main className="flex flex-1 print:h-fit h-[calc(100vh-150px)] border print:border-none">
                {children}
              </main>
              <footer className="footer print:hidden footer-center bg-base-300 text-deepBlue font-bold p-4">
                <aside>
                  <p>
                    Copyright © {new Date().getFullYear()} - All right reserved
                    by Dead Stock Section, Bangladesh Bank, Barishal.
                  </p>
                </aside>
              </footer>
            </div>
          </SessionProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
