import React from "react";
import { useSelector } from "react-redux";

const ThemeProvider = ({ children }) => {
  const { theme } = useSelector((state) => state.theme);
  
  return (
      <div className={`${
        theme === 'light' 
          ? 'bg-white text-gray-700' 
          : 'bg-[rgb(16,23,42)] text-gray-200'
      } min-h-screen`}>
        {children}
      </div>
  );
};

export default ThemeProvider;
