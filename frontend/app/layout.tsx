/**
 * Root Layout (Professional Dashboard Layout)
 * -------------------------------------------
 * - Fixed Sidebar
 * - Full-width Navbar
 * - Clean spacing system
 * - Proper alignment
 */

import "./globals.css";
import Sidebar from "@/components/Sidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900">

        <div className="flex h-screen">

          {/* ================= SIDEBAR ================= */}
          <aside className="w-64 hidden md:flex flex-col bg-gradient-to-b from-slate-900 to-slate-800 text-white fixed h-full">
            <Sidebar />
          </aside>

          {/* ================= MAIN ================= */}
          <div className="flex-1 flex flex-col md:ml-64">

            {/* NAVBAR SPACE (not component here) */}
            <div className="h-16" />

            {/* CONTENT */}
            <main className="flex-1 overflow-y-auto px-6 pb-6">
              {children}
            </main>

          </div>

        </div>

      </body>
    </html>
  );
}