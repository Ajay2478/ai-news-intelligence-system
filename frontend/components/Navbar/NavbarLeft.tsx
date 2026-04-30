/**
 * Navbar Left Section
 * - Logo + optional menu toggle (future)
 */

export default function NavbarLeft() {
  return (
    <div className="flex items-center gap-3">

      {/* Logo */}
      <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold">
        AI
      </div>

      {/* Title */}
      <div className="hidden md:block">
        <p className="font-semibold text-gray-800">News AI</p>
        <p className="text-xs text-gray-500">Intelligence</p>
      </div>

    </div>
  );
}