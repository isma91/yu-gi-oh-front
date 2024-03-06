"use client";
import Header from "@components/layout/Header";
import { Grid } from "@mui/material";

/**
 *
 * @param {LayoutProps} props
 * @returns {React.JSX.Element}
 */
export default function Layout({ children }: { children: React.ReactNode }): React.JSX.Element {
    return (
        <main id="root">
            <Header />
            <Grid container spacing={0}>
                {children}
            </Grid>
        </main>
    );
}
