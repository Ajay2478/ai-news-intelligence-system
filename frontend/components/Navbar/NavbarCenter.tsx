/**
 * Navbar Center Section
 * - Holds SearchBar
 */

import SearchBar from "./SearchBar";

interface Props {
  search: string;
  setSearch: (value: string) => void;
}

export default function NavbarCenter({ search, setSearch }: Props) {
  return (
    <SearchBar search={search} setSearch={setSearch} />
  );
}