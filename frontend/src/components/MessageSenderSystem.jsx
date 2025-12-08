import { formatDistanceToNow } from "date-fns";
export default function MessageSenderSystem({ character, message, timestamp }) {
  return (
    <div className="flex gap-3 w-full">
      <div className="avatar ">
        <div className="w-10 h-10 rounded-full">
          <img alt={character.name} src={character.avatarUrl} />
        </div>
      </div>
      <div className="flex flex-col gap-1 w-full">
        <div className="text-sm text-primary font-semibold">
          {character.name}
          <span className="text-xs text-base-content/50 font-normal ml-2">
            {formatDistanceToNow(timestamp, { addSuffix: true })}
          </span>
        </div>
        <div className="w-fit sm:max-w-[60%] bg-base-500 shadow-sm text-white rounded-lg px-4 py-2 text-sm break-words whitespace-pre-wrap ">
          {message}
        </div>
      </div>
    </div>
  );
}
