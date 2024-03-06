"use client";
import { createTheme, Theme, ThemeProvider as TP } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

declare module "@mui/material/styles" {
    interface Palette {
        third: Palette["primary"];
    }
    interface PaletteOptions {
        third?: PaletteOptions["primary"];
    }
}

//Module Augmentation to multiple component to avoid TS error and use the new "third" color
declare module "@mui/material/Button" {
    interface ButtonPropsColorOverrides {
        third: true;
    }
}

declare module "@mui/material/CircularProgress" {
    interface CircularProgressPropsColorOverrides {
        third: true;
    }
}

const Theme: Theme = createTheme({
    palette: {
        primary: {
            main: "#0070ff",
            //main: "#ff0000",
        },
        secondary: {
            main: "#0095b6",
        },
        third: {
            main: "#08e8de",
        },
        warning: {
            main: "#ffff66",
            dark: "#ffcc66",
            light: "#ffffcc",
        },
        info: {
            main: "#0066ff",
            dark: "#0033ff",
            light: "#3399ff",
        },
    },
});

function ThemeProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
    return (
        <TP theme={Theme}>
            <CssBaseline />
            {children}
        </TP>
    );
}

export default ThemeProvider;
