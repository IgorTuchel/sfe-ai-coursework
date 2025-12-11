export default function ChatBackground({ theme }) {
  return (
    <>
      {/* Wallpaper */}
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

      {/* Overlay */}
      {theme?.backgroundImageUrl && (
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            backgroundColor: `rgba(0,0,0, ${
              theme.backgroundOverlayOpacity ?? 0.5
            })`,
            backdropFilter: "blur(1px)",
          }}
        />
      )}
    </>
  );
}
