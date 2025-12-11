export default function CharacterHeader({ character, theme }) {
  if (!character) return null;

  return (
    <div className="flex gap-3 w-full flex-col justify-center items-center mt-4">
      <div className="avatar">
        <div className="w-36 h-36 border-2 border-(--theme-primary) p-1 rounded-full">
          <img
            className="rounded-full"
            alt={character.name}
            src={character.avatarUrl}
          />
        </div>
      </div>
      <div className="flex flex-col text-center gap-2 w-[50%]">
        <h2
          className="text-2xl font-bold text-center"
          style={{
            color: theme?.systemMessageColor || undefined,
          }}>
          {character.name}
        </h2>
        <p className="text-sm text-center text-base-content/70">
          {character.description}
        </p>
      </div>
    </div>
  );
}
