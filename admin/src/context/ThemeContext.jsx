import React, { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

const ThemeContextProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  // ✅ Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("adminDarkMode");
    if (saved === "true") setDarkMode(true);
  }, []);

  // ✅ Apply theme to body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("adminDarkMode", "true");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("adminDarkMode", "false");
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContextProvider;



