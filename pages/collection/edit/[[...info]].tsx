import { useState, useEffect, useContext, useMemo, useCallback } from "react";
import DashboardHome from "@components/dashboard/Home";
import { useSnackbar } from "notistack";
import { useRouter } from "next/router";
import { useTheme, Theme, Grid, Skeleton, Typography, useMediaQuery } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { StoreContext } from "@app/lib/state-provider";
import useRouterQuery from "@app/hooks/useRouterQuery";
import GenericStyles from "@app/css/style";
import { CollectionRouteName, GetFullRoute } from "@routes/Collection";
import { CollectionGetInfoType } from "@app/types/entity/Collection";
import CollectionGetInfoRequest from "@api/Collection/GetInfo";
import { CollectionInfoType } from "@app/types/Collection";
import { CardSearchType } from "@app/types/entity/Card";
import DisplayCollection from "@components/collection/DisplayCollection";
import DeckSearchCard from "@components/deck/SearchCard";
import { IsAdmin } from "@utils/Role";
import { TransformCollectionInfoToCardCollectionInfo } from "@utils/Collection";
import CollectionEditForm from "@form/collection/edit";

const useStyles = makeStyles((theme: Theme) => ({
    deckTitle: {
        fontWeight: "bolder",
        fontSize: "1.2rem",
    },
    deckIcon: {
        verticalAlign: "text-bottom",
    },
}));

export default function CollectionEditPage() {
    const { state: globalState } = useContext(StoreContext);
    const router = useRouter();
    const classes = useStyles();
    const genericClasses = GenericStyles();
    const { enqueueSnackbar } = useSnackbar();
    const customRouterQuery = useRouterQuery(router.query);
    const Theme = useTheme();
    const mediaQueryUpMd = useMediaQuery(Theme.breakpoints.up("md"));
    const [openCardDialog, setOpenCardDialog] = useState<boolean>(false);
    const [cardDialogInfo, setCardDialogInfo] = useState<CardSearchType | null>(null);
    const [cardCollection, setCardCollection] = useState<CollectionInfoType[]>([]);
    const limitArray: number[] = [15, 30, 45, 60];
    const [collectionInfo, setCollectionInfo] = useState<CollectionGetInfoType | null>(null);
    const [loading, setLoading] = useState(true);
    const [skip, setSkip] = useState(false);
    const collectionCurrentUserListPage = useMemo(() => GetFullRoute(CollectionRouteName.LIST), []);
    const handleResData = useCallback(
        (resData: CollectionGetInfoType | null) => {
            if (
                resData !== null &&
                globalState.user !== null &&
                (IsAdmin(globalState) === true || globalState.user.username === resData.user.username)
            ) {
                setCollectionInfo(resData);
                const transformedData = TransformCollectionInfoToCardCollectionInfo(resData);
                setCardCollection(transformedData);
            }
        },
        [globalState]
    );
    const queryKeyName = "info";

    useEffect(() => {
        if (globalState.user !== null && customRouterQuery.loading === false && skip === false) {
            const { query } = customRouterQuery;
            const queryKeyArray = Object.keys(query);
            if (queryKeyArray.length === 0 || queryKeyArray.includes(queryKeyName) === false) {
                router.push(collectionCurrentUserListPage);
            } else {
                const queryInfoArray = query[queryKeyName] as string[];
                if (queryInfoArray.length === 0) {
                    router.push(collectionCurrentUserListPage);
                }
                let collectionId = null;
                for (let i = 0; i < queryInfoArray.length; i++) {
                    const el = queryInfoArray[i];
                    const elInt = parseInt(el, 10);
                    if (Number.isNaN(elInt) === false) {
                        collectionId = elInt;
                        break;
                    }
                }
                if (collectionId === null) {
                    setLoading(false);
                    setSkip(true);
                } else {
                    CollectionGetInfoRequest(collectionId)
                        .then((res) => {
                            handleResData(res.data.collection);
                        })
                        .catch((err) => enqueueSnackbar(err, { variant: "error" }))
                        .finally(() => {
                            setLoading(false);
                            setSkip(true);
                        });
                }
            }
        }
    }, [customRouterQuery, globalState, handleResData, enqueueSnackbar, skip, collectionCurrentUserListPage, router]);

    return (
        <DashboardHome active={4} title="Collection edit Page">
            <Grid container spacing={2} sx={{ marginTop: (theme) => theme.spacing(1), height: "100%" }}>
                {loading === true ? (
                    <Grid item xs={12}>
                        <Skeleton animation="wave" variant="rounded" width="100%" height="50vh" />
                    </Grid>
                ) : collectionInfo !== null ? (
                    <>
                        <Grid item xs={12} md={6} container spacing={2} sx={{ height: "fit-content" }}>
                            <Grid item xs={12}>
                                <CollectionEditForm cardCollection={cardCollection} cardCollectionInfo={collectionInfo} />
                            </Grid>
                            <Grid item xs={12}>
                                <DisplayCollection
                                    cardCollectionState={[cardCollection, setCardCollection]}
                                    openDialogState={[openCardDialog, setOpenCardDialog]}
                                    cardDialogInfoState={[cardDialogInfo, setCardDialogInfo]}
                                />
                            </Grid>
                        </Grid>
                        <Grid item xs={12} md={6} container spacing={2} sx={{ height: "fit-content" }}>
                            <DeckSearchCard
                                openDialogState={[openCardDialog, setOpenCardDialog]}
                                limitArray={limitArray}
                                autoClick={false}
                                setCardDialogInfo={setCardDialogInfo}
                            />
                        </Grid>
                    </>
                ) : (
                    <Grid item xs={12} sx={{ height: "100%" }}>
                        <Typography component="p">Collection not found, maybe the url is broken ?</Typography>
                    </Grid>
                )}
            </Grid>
        </DashboardHome>
    );
}
