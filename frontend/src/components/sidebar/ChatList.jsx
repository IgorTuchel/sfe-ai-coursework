import { LuChevronsRight } from "react-icons/lu";
import RecentChat from "../RecentChatHistory";

export default function ChatList({ chats }) {
  return (
    <>
      <a
        href="/dashboard/history"
        className="text-xs font-bold mb-3 text-primary justify-between flex items-center"
        aria-label="View all chat history">
        <span>CHAT HISTORY</span>
        <LuChevronsRight
          className="inline-block ml-1 w-4 h-4 opacity-60"
          aria-hidden="true"
        />
      </a>

      <div className="space-y-2 flex-1 overflow-y-auto">
        {chats.map((chat) => (
          <a
            href={`/dashboard/chat/${chat._id}`}
            key={chat._id}
            className="flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-base-100/30 transition-all group hover:border-primary focus:border-primary focus:outline-none border border-transparent"
            aria-label={`Go to conversation ${chat?.chatName}`}>
            <RecentChat chat={chat} />
          </a>
        ))}
      </div>
    </>
  );
}
