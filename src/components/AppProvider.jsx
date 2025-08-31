import React, { createContext, useContext, useState } from "react";

const AppContext = createContext(undefined);

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const logout = () => setUser(null);
  const logo = "/ceres.png";
  const smLogo = "/ceres-logo-sm.png";
  const iconCLAI = "/CLAi.png";
  const bg = "/ceres-logo-bg.png";
  const plaidLogo = "/plaid.png";
  const colorPrimary = "#129fd4";

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        logout,
        logo,
        iconCLAI,
        smLogo,
        bg,
        plaidLogo,
        colorPrimary,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
/* eslint-disable react-refresh/only-export-components */
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};
