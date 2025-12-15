export default function ChatBackground({ theme }) {
  return (
    <>
      {theme?.backgroundImageUrl && (
        <div
          className="absolute inset-0 z-0 transition-opacity duration-500"
          style={{
            backgroundImage: `url(${theme.backgroundImageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      )}

      {theme?.backgroundImageUrl && (
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            backgroundColor: theme.backgroundColor || "transparent",
            opacity: theme.backgroundOverlayOpacity || 0.5,
            backdropFilter: "blur(1px)",
          }}
        />
      )}
    </>
  );
}
