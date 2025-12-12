import { LuBookmark, LuMessageCircleMore } from "react-icons/lu";

export default function SidebarActions() {
  return (
    <section className="px-4 mb-4 flex flex-col gap-3">
      <a
        href="/dashboard"
        className="btn btn-primary border-0 bg-primary-700 text-lg text-white w-full gap-2 shadow-lg"
        aria-label="Start new chat">
        Start Chat
        <LuMessageCircleMore className="w-5 h-5" aria-hidden="true" />
      </a>

      <a
        href="/dashboard/history?filter=bookmarked"
        className="btn btn-ghost btn-sm justify-start w-full gap-3 text-base-content/80 hover:bg-base-600/50 border-0"
        aria-label="View bookmarks">
        <LuBookmark className="w-4 h-4" aria-hidden="true" />
        Bookmarks
      </a>
    </section>
  );
}
