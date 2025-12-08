import { LuShare } from "react-icons/lu";

export default function CharacterCard({ character, onChat }) {
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
        <div>
          <h2 className="card-title text-base sm:text-xl font-bold text-primary leading-tight">
            {character?.name}
          </h2>

          <p className="text-xs text-base-content/70 line-clamp-4 text-left mt-1">
            {character?.description}
          </p>
        </div>

        <div className="flex gap-2 w-full">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onChat(character.id);
            }}
            className="btn btn-xs sm:btn-sm text-base-100 font-bold btn-primary flex-grow">
            Chat
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="btn btn-xs sm:btn-sm btn-ghost btn-circle flex-shrink-0">
            <LuShare className="w-4 h-4" tooltip="Share" />
          </button>
        </div>
      </div>
    </article>
  );
}
