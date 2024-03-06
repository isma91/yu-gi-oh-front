import { AppBar, Toolbar, Grid, Theme } from "@mui/material";
import Link from "next/link";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme: Theme) => ({}));

/**
 * @returns {JSX.Element}
 */
export default function Header(): JSX.Element {
    const classes = useStyles();

    return (
        <AppBar elevation={0} position="static">
            <Toolbar>
                <Grid container>
                    <Grid item></Grid>
                </Grid>
            </Toolbar>
        </AppBar>
    );
}
