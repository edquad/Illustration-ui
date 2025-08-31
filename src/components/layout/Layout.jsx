import React, { useState } from "react";
import { Box, Toolbar } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Sidebar from "./Sidebar";
import Header from "./Header";

const Layout = ({ children, headerRight }) => {
  const [selected, setSelected] = useState("/home");
  const [collapsed, setCollapsed] = useState(true);
  const theme = useTheme();

  const handleDrawerToggle = () => setCollapsed((prev) => !prev);

  return (
    <Box
      sx={{
        display: "flex",
        background: theme.palette.background.default,
      }}
    >
      <Sidebar
        selected={selected}
        onSelect={setSelected}
        collapsed={collapsed}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: "#fafbfc",
          display: "flex",
          flexDirection: "column",
          overflowY: "hidden",
        }}
      >
        <Header onMenuClick={handleDrawerToggle} headerRight={headerRight} />
        <Box
          component={"aside"}
          sx={{
            p: 2,
            overflowY: "auto",
            height: "calc(100vh - 65px)",
            overflowX: "hidden",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;