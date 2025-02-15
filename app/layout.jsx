
"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./globals.css";
import Header from "../components/header/Header";
import { useState } from "react";
import { AuthProvider, useAuth } from "../contexts/authContext";






export default function RootLayout({ children }) {
  const [queryClient] = useState(() => new QueryClient());






  return (
    <html lang="en">
      <body>


        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <main className="text-[#007f40] flex flex-col h-screen max-w-screen-2xl mx-auto bg-base-200  print:h-fit">
              <Header />
              <div className="grow mx-auto h-[calc(100vh-235px)] overflow-auto print:overflow-visible flex  print:h-fit">
                {children}
              </div>
              <footer className="footer print:hidden footer-center bg-base-300 text-warning font-bold p-4">
                <aside>
                  <p>Copyright © {new Date().getFullYear()} - All right reserved by Dead Stock Section, Bangladesh Bank, Barishal.</p>
                </aside>
              </footer>
            </main>
          </AuthProvider>
        </QueryClientProvider>





      </body>
    </html>
  );
}
