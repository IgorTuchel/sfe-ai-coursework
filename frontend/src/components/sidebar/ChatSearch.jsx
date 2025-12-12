import { LuSearch } from "react-icons/lu";

export default function ChatSearch({ searchQuery, onSearchChange }) {
  return (
    <label
      className="input input-primary input-sm rounded-lg input-bordered flex items-center flex-shrink-0 gap-2 bg-base-100/50 border-primary/30 focus-within:border-primary mb-4 transition-colors w-full"
      aria-label="Search chats">
      <LuSearch className="w-4 h-4 opacity-60" aria-hidden="true" />
      <input
        type="text"
        className="grow bg-transparent caret-primary text-base-content placeholder-base-content/40"
        placeholder="Search chats..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        aria-label="Search chats"
      />
    </label>
  );
}
