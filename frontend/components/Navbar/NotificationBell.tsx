"use client";

import { useState, useRef, useEffect } from "react";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      {/* Bell Button */}
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg hover:bg-gray-100"
      >
        🔔

        {/* Notification Badge */}
        <span className="absolute top-1 right-1 w-2 h-2 bg-purple-500 rounded-full"></span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white border rounded-xl shadow-lg p-4 z-50">
          <h4 className="font-semibold mb-2">Notifications</h4>

          <div className="space-y-2 text-sm text-gray-600">
            <p>New article processed</p>
            <p>Trending topic updated</p>
            <p>System insights generated</p>
          </div>
        </div>
      )}
    </div>
  );
}