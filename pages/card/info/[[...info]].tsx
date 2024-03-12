import React, { useState, useEffect, useContext } from "react";
import { StoreContext } from "@app/lib/state-provider";
import useRouterQuery from "@app/hooks/useRouterQuery";
import { useSnackbar } from "notistack";
import { useRouter } from "next/router";
import { CardRouteName, GetFullRoute } from "@routes/Card";
import { CheckUuid } from "@utils/String";
import DashboardHome from "@components/dashboard/Home";
import CardGetInfoRequest from "@api/Card/GetInfo";
import { Grid, Skeleton, Typography } from "@mui/material";

export default function CardInfoPage() {
    const { state: globalState } = useContext(StoreContext);
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const { query, loading: loadingRouterQuery } = useRouterQuery(router.query);
    const [cardInfo, setCardInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const queryKeyName = "info";

    const redirectToCardSearchPage = () => {
        router.push(GetFullRoute(CardRouteName.CARD_SEARCH));
    };

    const getCardInfoReq = async (cardUuid: string) => {
        return CardGetInfoRequest(cardUuid)
            .then((res) => {
                console.log(res.data.card);
            })
            .catch((err) => {
                enqueueSnackbar(err, { variant: "error" });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        if (globalState.user !== null && loadingRouterQuery === false) {
            const queryKeyArray = Object.keys(query);
            if (queryKeyArray.length === 0 || queryKeyArray.includes(queryKeyName) === false) {
                redirectToCardSearchPage();
            } else {
                const queryInfoArray = query[queryKeyName] as string[];
                if (queryInfoArray.length === 0) {
                    redirectToCardSearchPage();
                }
                let cardUuidString = null;
                for (let i = 0; i < queryInfoArray.length; i++) {
                    const el = queryInfoArray[i];
                    if (CheckUuid(el) === true) {
                        cardUuidString = el;
                        break;
                    }
                }
                if (cardUuidString === null) {
                    setLoading(false);
                } else {
                    getCardInfoReq(cardUuidString);
                }
            }
        }
    }, [loadingRouterQuery, globalState]);

    return (
        <DashboardHome active={1} title="Card Info Page">
            <Grid container spacing={2} sx={{ marginTop: (theme) => theme.spacing(1) }}>
                {loading === true ? (
                    <Grid item xs={12}>
                        <Skeleton animation="wave" variant="rounded" width="100%" height="50vh" />
                    </Grid>
                ) : cardInfo === null ? (
                    <Grid item xs={12}>
                        <Typography component="p">Card not found, maybe the url is broken ?</Typography>
                    </Grid>
                ) : null}
            </Grid>
        </DashboardHome>
    );
}
