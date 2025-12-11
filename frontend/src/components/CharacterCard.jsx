import { LuMessageSquare, LuPencil } from "react-icons/lu";

export default function CharacterCard({ character, onChat, isAdmin }) {
  return (
    <article className="card bg-base-600 h-40 shadow-md rounded-2xl overflow-hidden border border-base-500/50 hover:shadow-lg transition-all hover:border-primary/60 flex flex-row hover:bg-base-500/50 hover:shadow-primary/20 group">
      <figure className="w-32 sm:w-40 h-full p-0 m-0 overflow-hidden bg-base-700 flex-shrink-0 relative">
        <img
          src={
            character?.avatarUrl ||
            "https://bournemouth-uni-software-engineering-coursework.s3.eu-north-1.amazonaws.com/avatars/default-avatar.png"
          }
          alt={`Avatar of ${character?.name}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-base-900/20" />
      </figure>

      <div className="card-body p-3 sm:p-4 gap-2 flex-grow flex flex-col justify-between">
        <div className="flex-grow overflow-hidden">
          <div className="flex items-start justify-between gap-2">
            <h2 className="card-title text-base sm:text-xl font-bold text-primary leading-tight">
              {character?.name}
            </h2>
            {character?.isPublic === false && (
              <span className="text-xs text-base-content/50 italic whitespace-nowrap">
                Private
              </span>
            )}
          </div>

          <p className="text-xs text-base-content/70 line-clamp-3 text-left mt-1">
            {character?.description}
          </p>
        </div>

        <div className="flex gap-2 w-full mt-auto">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onChat(character?._id);
            }}
            className="btn btn-xs sm:btn-sm text-base-100 font-bold btn-primary flex-grow flex items-center justify-center gap-1">
            <LuMessageSquare className="w-3 h-3 sm:w-4 sm:h-4" />
            Chat
          </button>
          {isAdmin && (
            <a
              href={`/dashboard/characters/create/${character?._id}`}
              onClick={(e) => e.stopPropagation()}
              className="btn btn-xs sm:btn-sm text-base-100 font-bold btn-secondary flex items-center justify-center gap-1 flex-shrink-0">
              <LuPencil className="w-3 h-3 sm:w-4 sm:h-4" />
              Edit
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
