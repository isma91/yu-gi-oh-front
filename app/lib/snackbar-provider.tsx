"use client";
import { SnackbarProvider as SP } from "notistack";

function SnackbarProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
    return (
        <SP
            maxSnack={1}
            autoHideDuration={3000}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
            }}
            preventDuplicate={false}
        >
            {children}
        </SP>
    );
}

export default SnackbarProvider;
