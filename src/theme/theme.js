import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' },
    background: { default: '#fafbfc', paper: '#fff' },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#2196f3' },
    background: {
      default: '#181a1b',
      paper: '#181a1b',
    },
    text: {
      primary: '#fff',
      secondary: '#b0b0b0',
    },
    divider: '#23272b',
    action: {
      selected: '#23272b',
      hover: '#23272b',
    },
  },
});