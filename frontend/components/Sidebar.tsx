"use client";

/**
 * Sidebar Navigation (Functional)
 */

import Link from "next/link";
import { usePathname } from "next/navigation";

const menu = [
  { name: "Dashboard", path: "/" },
  { name: "Headlines", path: "/headlines" },
  { name: "Trends", path: "/trends" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white p-4 flex flex-col justify-between">

      {/* Top */}
      <div>
        <h1 className="text-lg font-semibold mb-6">News AI</h1>

        <div className="space-y-2">
          {menu.map((item) => {
            const isActive = pathname === item.path;

            return (
              <Link key={item.path} href={item.path}>
                <div
                  className={`px-4 py-2 rounded-lg cursor-pointer transition ${
                    isActive
                      ? "bg-gradient-to-r from-purple-500 to-indigo-500"
                      : "hover:bg-white/10"
                  }`}
                >
                  {item.name}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Bottom user */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
          N
        </div>
        <div>
          <p className="text-sm">Ajay</p>
          <p className="text-xs text-gray-400">admin</p>
        </div>
      </div>
    </div>
  );
}