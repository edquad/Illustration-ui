import React, { useState } from "react";
import { useApp } from "../AppProvider";
import { useTheme } from "@mui/material/styles";
import LogoutIcon from "@mui/icons-material/Logout";
import { NavLink, useLocation } from "react-router-dom";
import ListItemButton from "@mui/material/ListItemButton";
import DescriptionIcon from "@mui/icons-material/Description";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Box,
  List,
  Drawer,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Collapse,
  Menu,
  MenuItem,
} from "@mui/material";

const expandedWidth = 200;
const collapsedWidth = 83;

const navItems = [
  { label: "Illustration", icon: <DescriptionIcon />, path: "/Illustration" },
];

const Sidebar = ({ onSelect, collapsed }) => {
  const theme = useTheme();
  const location = useLocation();
  const { logout, logo, smLogo, colorPrimary } = useApp();
  const [expandedMenus, setExpandedMenus] = useState({});
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [activeSubItems, setActiveSubItems] = useState([]);

  const handleMenuToggle = (label) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const isSubMenuActive = (subItems) => {
    return subItems.some((item) => location.pathname === item.path);
  };

  const renderNavItem = (item) => {
    const isActive = location.pathname === item.path;
    const isSubMenuExpanded = expandedMenus[item.label] || false;
    const hasActiveSubItem = item.hasSubMenu && isSubMenuActive(item.subItems);

    return (
      <React.Fragment key={item.label}>
        <ListItem disablePadding sx={{ display: "block" }}>
          <ListItemButton
            component={item.hasSubMenu ? "div" : NavLink}
            to={item.hasSubMenu ? undefined : item.path}
            onClick={(event) => {
              if (item.hasSubMenu) {
                if (collapsed) {
                  setMenuAnchorEl(event.currentTarget);
                  setActiveSubItems(item.subItems);
                } else {
                  handleMenuToggle(item.label);
                }
              } else {
                onSelect(item.path);
              }
            }}
            selected={isActive || hasActiveSubItem}
            sx={{
              minHeight: 45,
              justifyContent: "center",
              flexDirection: collapsed ? "column" : "row",
              alignItems: "center",
              px: 2,
              py: 1,
              mx: 1,
              my: 1,
              borderRadius: 2,
              color: "#ffffff",
              background:
                isActive || hasActiveSubItem
                  ? theme.palette.action.selected
                  : "transparent",
              "&:hover": {
                background: "rgba(255,255,255,0.08)",
              },
              "&.Mui-selected": {
                background: colorPrimary,
                color: "#ffffff",
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: collapsed ? 0 : 3,
                justifyContent: "center",
                color: "inherit",
              }}
            >
              {item.icon}
            </ListItemIcon>
            {!collapsed && (
              <>
                <ListItemText
                  primary={item.label}
                  sx={{
                    opacity: collapsed ? 0 : 1,
                    color: "inherit",
                    "& .MuiListItemText-primary": {
                      fontSize: "0.875rem",
                      fontWeight: isActive || hasActiveSubItem ? 600 : 400,
                    },
                  }}
                />
                {item.hasSubMenu &&
                  (isSubMenuExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />)}
              </>
            )}
            {collapsed && (
              <Box
                sx={{
                  fontSize: "0.75rem",
                  mt: 0.5,
                  textAlign: "center",
                  lineHeight: 1,
                }}
              >
                {item.label}
              </Box>
            )}
          </ListItemButton>
        </ListItem>
        {item.hasSubMenu && !collapsed && (
          <Collapse in={isSubMenuExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.subItems.map((subItem) => {
                const isSubActive = location.pathname === subItem.path;
                return (
                  <ListItem key={subItem.label} disablePadding>
                    <ListItemButton
                      component={NavLink}
                      to={subItem.path}
                      onClick={() => onSelect(subItem.path)}
                      selected={isSubActive}
                      sx={{
                        pl: 4,
                        minHeight: 40,
                        mx: 1,
                        borderRadius: 2,
                        color: "#ffffff",
                        background: isSubActive
                          ? theme.palette.action.selected
                          : "transparent",
                        "&:hover": {
                          backgroundColor: theme.palette.action.hover,
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: 2,
                          justifyContent: "center",
                          color: "inherit",
                        }}
                      >
                        {subItem.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={subItem.label}
                        sx={{
                          color: "inherit",
                          "& .MuiListItemText-primary": {
                            fontSize: "0.8rem",
                            fontWeight: isSubActive ? 600 : 400,
                          },
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    );
  };

  return (
    <>
      <Drawer
        variant="permanent"
        sx={{
          width: collapsed ? collapsedWidth : expandedWidth,
          flexShrink: 0,
          whiteSpace: "nowrap",
          boxSizing: "border-box",
          height: "100vh",
          [`& .MuiDrawer-paper`]: {
            width: collapsed ? collapsedWidth : expandedWidth,
            transition: "width 0.2s",
            overflowX: "hidden",
            borderRight: `1px solid ${theme.palette.divider}`,
            background: "#324154",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxShadow: "0 0 10px #0a0a0a",
          },
        }}
      >
        <div>
          <Box
            component="img"
            src={collapsed ? smLogo : logo}
            alt="Cereslife Logo"
            sx={{
              p: 2,
              pb: 0,
              mx: collapsed ? "auto" : "",
              display: "flex",
              width: collapsed ? "60px" : "150px",
            }}
          />
          <Box sx={{ overflow: "auto" }}>
            <List>
              {navItems.map((item, index) => renderNavItem(item, index))}
            </List>
          </Box>
          <Divider sx={{ borderColor: "#7e7e7e" }} />
          <List>
            <ListItem disablePadding>
              <ListItemButton
                onClick={logout}
                sx={{
                  minHeight: 45,
                  justifyContent: "center",
                  flexDirection: collapsed ? "column" : "row",
                  alignItems: "center",
                  px: 2,
                  py: 1,
                  mx: 1,
                  my: 1,
                  borderRadius: 2,
                  color: "#ffffff",
                  "&:hover": {
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: collapsed ? 0 : 3,
                    justifyContent: "center",
                    color: "inherit",
                  }}
                >
                  <LogoutIcon />
                </ListItemIcon>
                {!collapsed && (
                  <ListItemText
                    primary="Logout"
                    sx={{
                      color: "inherit",
                      "& .MuiListItemText-primary": {
                        fontSize: "0.875rem",
                      },
                    }}
                  />
                )}
                {collapsed && (
                  <Box
                    sx={{
                      fontSize: "0.75rem",
                      mt: 0.5,
                      textAlign: "center",
                      lineHeight: 1,
                    }}
                  >
                    Logout
                  </Box>
                )}
              </ListItemButton>
            </ListItem>
          </List>
        </div>
        {/* Floating submenu for collapsed sidebar */}
        {/* <Menu
          anchorEl={menuAnchorEl}
          open={Boolean(menuAnchorEl)}
          onClose={() => setMenuAnchorEl(null)}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
          PaperProps={{
            style: {
              backgroundColor: "#fff",
              boxShadow: "0px 4px 8px rgba(0,0,0,0.2)",
              marginLeft: "5px",
            },
          }}
        >
          {activeSubItems.map((subItem) => (
            <MenuItem
              key={subItem.path}
              onClick={() => {
                onSelect(subItem.path);
                setMenuAnchorEl(null);
              }}
              component={NavLink}
              to={subItem.path}
              sx={{ fontSize: "14px", color: "#333" }}
            >
              {subItem.label}
            </MenuItem>
          ))}
        </Menu> */}

        {/* Footer */}
        {/* {!collapsed ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              px: 2,
              pb: 1,
              textAlign: "center",
              fontSize: "11px",
              gap: 0.5,
              color: "#879abe",
            }}
          >
            <Link href="#" color="#e4e4e4cc">
              Privacy Policy
            </Link>
            <Link href="#" color="#e4e4e4cc">
              Terms of Service
            </Link>
            <small>
              @ 2025 Ceres Insurance co. <br /> All rights reserved
            </small>
          </Box>
        ) : (
          <Box
            sx={{
              color: "#879abe",
              fontSize: "8px",
              textAlign: "center",
              pb: 1,
            }}
          >
            @ 2025 <br />
            Ceres Insurance co. <br />
            All rights reserved
          </Box>
        )} */}
      </Drawer>
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={() => setMenuAnchorEl(null)}
        anchorOrigin={{
          vertical: "center",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "left",
        }}
      >
        {activeSubItems.map((subItem) => (
          <MenuItem
            key={subItem.label}
            component={NavLink}
            to={subItem.path}
            onClick={() => {
              onSelect(subItem.path);
              setMenuAnchorEl(null);
            }}
          >
            <ListItemIcon>{subItem.icon}</ListItemIcon>
            <ListItemText primary={subItem.label} />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default Sidebar;
