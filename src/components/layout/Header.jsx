import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Avatar,
} from "@mui/material";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import { useApp } from "../AppProvider";
import PersonIcon from "@mui/icons-material/Person";
import { useLocation } from "react-router-dom";

const Header = ({ onMenuClick, headerRight }) => {
  const location = useLocation();
  const { user, logo } = useApp();

  return (
    <AppBar
      position="static"
      color="inherit"
      elevation={0}
      sx={{ borderBottom: "1px solid #eee", zIndex: 1201 }}
    >
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
          onClick={onMenuClick}
        >
          <MenuOpenIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }} />
        <Avatar sx={{ mr: 1 }}>
          <PersonIcon />
        </Avatar>
        <strong>{user ? `${user.name}` : ""}</strong>
        {headerRight}
      </Toolbar>
    </AppBar>
  );
};

export default Header;