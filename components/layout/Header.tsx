import { AppBar, Toolbar, Grid, Theme } from "@mui/material";
import Link from "next/link";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme: Theme) => ({
    logo: {
        width: "20%",
        height: "100%",
    },
}));

/**
 * @returns {JSX.Element}
 */
export default function Header(): JSX.Element {
    const classes = useStyles();

    return (
        <AppBar elevation={0} position="static">
            <Toolbar>
                <Grid container>
                    <Grid item>
                        <Link href="/">
                            <img src={"/image/logo.png"} className={classes.logo} alt="logo picture" />
                        </Link>
                    </Grid>
                </Grid>
            </Toolbar>
        </AppBar>
    );
}
