import { useState, useEffect, useContext } from "react";
import { useTheme, Theme, Grid, Skeleton, Typography, useMediaQuery } from "@mui/material";
import { StoreContext } from "@app/lib/state-provider";
import useRouterQuery from "@app/hooks/useRouterQuery";
import GenericStyles from "@app/css/style";
import { useSnackbar } from "notistack";
import { useRouter } from "next/router";
import { SetRouteName, GetFullRoute } from "@routes/Set";
import { makeStyles } from "@mui/styles";
import DashboardHome from "@components/dashboard/Home";

const useStyles = makeStyles((theme: Theme) => ({
    deckTitle: {
        fontWeight: "bolder",
        fontSize: "1.2rem",
    },
    deckIcon: {
        verticalAlign: "text-bottom",
    },
}));

export default function DeckInfoPage() {
    const { state: globalState } = useContext(StoreContext);
    const router = useRouter();
    const classes = useStyles();
    const genericClasses = GenericStyles();
    const { enqueueSnackbar } = useSnackbar();
    const { query, loading: loadingRouterQuery } = useRouterQuery(router.query);
    const Theme = useTheme();
    const mediaQueryUpMd = useMediaQuery(Theme.breakpoints.up("md"));
    const [setInfo, setSetInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const queryKeyName = "info";

    const redirectToSetSearchPage = () => {
        router.push(GetFullRoute(SetRouteName.SEARCH));
    };

    useEffect(() => {
        if (globalState.user !== null && loadingRouterQuery === false) {
            const queryKeyArray = Object.keys(query);
            if (queryKeyArray.length === 0 || queryKeyArray.includes(queryKeyName) === false) {
                redirectToSetSearchPage();
            } else {
                const queryInfoArray = query[queryKeyName] as string[];
                if (queryInfoArray.length === 0) {
                    redirectToSetSearchPage();
                }
                let setId = null;
                for (let i = 0; i < queryInfoArray.length; i++) {
                    const el = queryInfoArray[i];
                    const elInt = parseInt(el, 10);
                    if (Number.isNaN(elInt) === false) {
                        setId = elInt;
                        break;
                    }
                }
                if (setId === null) {
                    setLoading(false);
                } else {
                    console.log("done");
                }
            }
        }
    }, [loadingRouterQuery, globalState]);

    return (
        <DashboardHome active={2} title="Set info Page">
            <Grid container spacing={2} sx={{ marginTop: (theme) => theme.spacing(1), height: "100%" }}>
                {loading === true ? (
                    <Grid item xs={12}>
                        <Skeleton animation="wave" variant="rounded" width="100%" height="50vh" />
                    </Grid>
                ) : setInfo !== null ? (
                    "set"
                ) : (
                    <Grid item xs={12} sx={{ height: "100%" }}>
                        <Typography component="p">Set not found, maybe the url is broken ?</Typography>
                    </Grid>
                )}
            </Grid>
        </DashboardHome>
    );
}
