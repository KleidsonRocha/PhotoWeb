import React, { createContext, useState } from 'react';

export const NavbarContext = createContext();

export const NavbarProvider = ({ children }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleNavbar = () => {
    setIsExpanded(prev => !prev);
  };

  return (
    <NavbarContext.Provider value={{ isExpanded, toggleNavbar }}>
      {children}
    </NavbarContext.Provider>
  );
};