/**
 * @file NavbarContext.jsx
 * @description Context provider for managing navbar state.
 * Includes title, bookmark icon visibility, bookmark status, and chat ID.
 * @module context/NavbarContext
 */

import { createContext, useState } from "react";

// ignore:start
// eslint-disable-next-line react-refresh/only-export-components
export const NavbarContext = createContext(null);
// ignore:end

export const NavbarProvider = ({ children }) => {
  const [navBarTitle, setNavBarTitle] = useState("");
  const [showBookmarkIcon, setShowBookmarkIcon] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [chatID, setChatID] = useState(null);

  return (
    <NavbarContext.Provider
      value={{
        navBarTitle,
        setNavBarTitle,
        showBookmarkIcon,
        setShowBookmarkIcon,
        isBookmarked,
        setIsBookmarked,
        chatID,
        setChatID,
      }}>
      {children}
    </NavbarContext.Provider>
  );
};
