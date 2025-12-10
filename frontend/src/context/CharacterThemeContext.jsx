import { createContext } from "react";

const defaultTheme = {
  // --- GLOBAL ---
  fontFamily: "ui-sans-serif, system-ui, sans-serif", // 'sans', 'serif', 'mono'

  // --- BACKGROUND & WALLPAPER ---
  backgroundColor: "", // Fallback color if no image
  backgroundImageUrl: "", // The wallpaper URL
  backgroundOverlayOpacity: 0.4, // Black layer over image (0.0 to 1.0) to make text readable

  // --- MESSAGE BUBBLES ---
  primaryColor: "", // User Bubble BG
  userMessageColor: "", // User Text Color

  secondaryColor: "", // System Bubble BG
  systemMessageColor: "", // System Text Color

  bubbleOpacity: 1, // Transparency of bubbles
  bubbleBorderRadius: "1rem", // Roundness

  // --- INPUT BAR (The bottom area) ---
  inputBackgroundColor: "", // Color of the text box
  inputTextColor: "", // Color of typing text
  inputBorderColor: "", // Border around text box

  // --- ICONS & BUTTONS ---
  sendButtonColor: "", // Send button color
};

export const CharacterThemeContext = createContext(defaultTheme);

export const CharacterThemeProvider = ({ children, themeData }) => {
  const theme = { ...defaultTheme, ...themeData };

  return (
    <CharacterThemeContext.Provider value={theme}>
      {children}
    </CharacterThemeContext.Provider>
  );
};
