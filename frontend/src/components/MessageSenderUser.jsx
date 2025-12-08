import { formatDistanceToNow } from "date-fns";

export default function MessageSenderUser({ message, timestamp }) {
  return (
    <div className="flex gap-3 justify-end">
      <div className="flex flex-col gap-1 items-end max-w-[60%]">
        <div className="text-sm text-white font-semibold">
          You
          {/*  KAIDO DEV NOTE I need to add the auth later -- tf did I mean? oh yeas the username */}
          <span className="text-xs text-base-content/50 font-normal ml-2">
            {formatDistanceToNow(new Date(timestamp), { addSuffix: true })}
          </span>
        </div>
        <div className="w-fit bg-primary-900 shadow-2xl text-white rounded-lg px-4 py-2 text-sm break-words whitespace-pre-wrap text-left">
          {message}
        </div>
      </div>
    </div>
  );
}
