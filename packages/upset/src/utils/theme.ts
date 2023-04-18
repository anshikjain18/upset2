import { createTheme, ThemeOptions } from '@mui/material';

declare module '@mui/material/styles' {
  interface Theme {
    matrix: {
      member: {
        yes: '#636363';
        no: '#f0f0f0';
      };
    };
  }

  interface ThemeOptions {
    matrix?: {
      member?: {
        yes?: string;
        no?: string;
      };
    };
  }
}

const theme: ThemeOptions = {
  matrix: {
    member: {
      yes: '#636363',
      no: '#f0f0f0',
    },
  },
  components: {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "rgba(116, 173, 209, 0.85)",
          color: "#ffffff",
          fontSize: "0.9em",
        },
        arrow: {
          color: "rgba(116, 173, 209, 0.85)"
        }
      }
    }
  }
};

const defaultTheme = createTheme(theme);
export default defaultTheme;
