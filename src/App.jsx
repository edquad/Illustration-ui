import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "./components/AppProvider";
import { ThemeProvider } from "./theme/ThemeProvider";
import AppRoutes from "./routes/AppRoutes";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "./App.css";

function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <BrowserRouter>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <AppRoutes />
          </LocalizationProvider>
        </BrowserRouter>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
