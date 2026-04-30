/**
 * Search Bar Component
 * - Controlled input
 * - Handles search state
 */

interface Props {
  search: string;
  setSearch: (value: string) => void;
}

export default function SearchBar({ search, setSearch }: Props) {
  return (
    <div className="relative w-full">

      {/* Input */}
      <input
        type="text"
        placeholder="Search news, topics, entities..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full pl-10 pr-4 py-2 rounded-lg border bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Icon */}
      <span className="absolute left-3 top-2.5 text-gray-400 text-sm">
    
      </span>

    </div>
  );
}