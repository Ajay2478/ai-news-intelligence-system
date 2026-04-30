/**
 * Navbar (System Header)
 * - Full width
 * - No rounded box
 * - Aligned with sidebar
 */

import NavbarLeft from "./NavbarLeft";
import NavbarCenter from "./NavbarCenter";
import NavbarRight from "./NavbarRight";

interface Props {
  search: string;
  setSearch: (value: string) => void;
}

export default function Navbar({ search, setSearch }: Props) {
  return (
    <div className="fixed top-0 left-0 right-0 md:left-64 z-50 bg-white border-b h-16 flex items-center px-6">

      <div className="flex items-center justify-between w-full">

        <NavbarLeft />

        <div className="flex-1 max-w-xl mx-6">
          <NavbarCenter search={search} setSearch={setSearch} />
        </div>

        <NavbarRight />

      </div>

    </div>
  );
}