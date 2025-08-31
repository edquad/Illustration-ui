import React, { useState } from "react";
import {
  Box,
  InputBase,
  Divider,
  Tooltip,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Avatar,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import Person3Icon from "@mui/icons-material/Person3";

function ContactList({ contacts, searchTerm, onSearch, onSelect }) {
  const [selectedContactId, setSelectedContactId] = useState(null);

  const handleContactSelect = (contact) => {
    setSelectedContactId(contact.email);
    onSelect(contact);
  };

  const clearSearch = () => {
    onSearch("");
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Contact List
      </Typography>
      
      {/* Search Input */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          border: "1px solid #e0e0e0",
          borderRadius: 1,
          px: 1,
          mb: 2,
        }}
      >
        <InputBase
          placeholder="Search contacts..."
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
          sx={{ flex: 1, py: 0.5 }}
        />
        {searchTerm && (
          <Tooltip title="Clear search">
            <IconButton size="small" onClick={clearSearch}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      <Divider sx={{ mb: 1 }} />

      {/* Contact List */}
      <List sx={{ maxHeight: 400, overflow: "auto" }}>
        {contacts.map((contact) => (
          <ListItem key={contact.email} disablePadding>
            <ListItemButton
              selected={selectedContactId === contact.email}
              onClick={() => handleContactSelect(contact)}
              sx={{
                borderRadius: 1,
                mb: 0.5,
                "&.Mui-selected": {
                  backgroundColor: "primary.light",
                  "&:hover": {
                    backgroundColor: "primary.light",
                  },
                },
              }}
            >
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: "primary.main" }}>
                  {contact.gender === "Female" ? <Person3Icon /> : <PersonIcon />}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={`${contact.firstName} ${contact.lastName}`}
                secondary={
                  <>
                    <Typography component="span" variant="body2" color="text.primary">
                      {contact.email}
                    </Typography>
                    <br />
                    {contact.phone} • Age: {contact.age}
                  </>
                }
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {contacts.length === 0 && (
        <Box sx={{ textAlign: "center", py: 3 }}>
          <Typography variant="body2" color="text.secondary">
            No contacts found
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default ContactList;