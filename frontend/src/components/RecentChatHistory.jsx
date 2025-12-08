import { LuChevronRight } from "react-icons/lu";
import { formatDistanceToNow } from "date-fns";

export default function RecentChat({ chat }) {
  return (
    <>
      <div className="avatar shrink-0">
        <div className="w-10 rounded-full ring-1 ring-base-content/10 group-hover:ring-primary/50 transition-all">
          <img
            src={chat?.character.avatarUrl}
            alt={`Avatar of ${chat?.character.name}`}
          />
        </div>
      </div>

      <div className="flex flex-col grow min-w-0 gap-0.5">
        <span
          className="text-[10px] font-bold uppercase tracking-wider text-base-content/50 group-hover:text-primary/70 group-focus:text-primary/70 transition-colors"
          aria-label={`Character: ${chat?.character.name}`}>
          {chat?.character.name}
        </span>

        <span className="text-sm font-medium truncate text-base-content group-hover:text-primary group-focus:text-primary transition-colors">
          {chat?.chatName}
        </span>

        <span className="text-[10px] text-base-content/70">
          {chat?.updatedAt
            ? formatDistanceToNow(new Date(chat?.updatedAt), {
                addSuffix: true,
              })
            : ""}
        </span>
      </div>

      <LuChevronRight className="w-4 h-4 opacity-0 -translate-x-2 group-focus:opacity-100 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out text-primary shrink-0" />
    </>
  );
}
