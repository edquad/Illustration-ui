import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
} from "@mui/material";
import { useApp } from "../components/AppProvider";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { setUser, logo, colorPrimary } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agentName, setAgentName] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (email && password) {
      const sessionId = `session_${Date.now()}`;
      setUser({
        id: "1",
        name: "Varun Pande",
        email: email,
        sessionId: sessionId,
      });
      navigate("/Illustration");
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{ backgroundColor: "#f7fafd" }}
    >
      <Paper
        sx={{ p: 4, minWidth: 320, maxWidth: "400px", textAlign: "center" }}
        elevation={16}
      >
        <Box
          component="img"
          src={logo}
          alt="Cereslife Logo"
          sx={{ width: "70%", mb: 2 }}
        />
        <Typography variant="h5" mb={2}>
          Sign in to your account
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <form onSubmit={handleLogin}>
          <TextField
            label="AgentName"
            name="AgentName"
            type="text"
            fullWidth
            margin="normal"
            value={agentName}
            onChange={(e) => setAgentName(e.target.value)}
          />
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            size="large"
            type="submit"
            variant="contained"
            fullWidth
            className="!rounded-full"
            sx={{
              mt: 2,
              backgroundColor: colorPrimary,
              "&:hover": {
                backgroundColor: colorPrimary,
                opacity: 0.9,
              },
            }}
          >
            Login
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Login;
