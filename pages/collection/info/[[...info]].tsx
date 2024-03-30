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
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { IsAdmin } from "@utils/Role";
import Button from "@components/field/Button";
import Dialog from "@components/display/Dialog";
import CollectionGetInfoRequest from "@api/Collection/GetInfo";
import CollectionDeleteRequest from "@api/Collection/Delete";
import CollectionUpdatePublicFromIdRequest from "@api/Collection/UpdatePublic";
import { Pluralize } from "@utils/String";
import DisplayCollectionCard from "@components/collection/DisplayCard";

const useStyles = makeStyles((theme: Theme) => ({
    deckTitle: {
        fontWeight: "bolder",
        fontSize: "1.2rem",
    },
    deckIcon: {
        verticalAlign: "text-bottom",
    },
}));

export default function CollectionInfoPage() {
    const { state: globalState } = useContext(StoreContext);
    const router = useRouter();
    const classes = useStyles();
    const genericClasses = GenericStyles();
    const { enqueueSnackbar } = useSnackbar();
    const customRouterQuery = useRouterQuery(router.query);
    const Theme = useTheme();
    const mediaQueryUpMd = useMediaQuery(Theme.breakpoints.up("md"));
    const [collectionInfo, setCollectionInfo] = useState<CollectionGetInfoType | null>(null);
    const [loading, setLoading] = useState(true);
    const [skip, setSkip] = useState(false);
    const collectionCurrentUserListPage = useMemo(() => GetFullRoute(CollectionRouteName.LIST), []);
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
                            setCollectionInfo(res.data.collection);
                        })
                        .catch((err) => enqueueSnackbar(err, { variant: "error" }))
                        .finally(() => {
                            setLoading(false);
                            setSkip(true);
                        });
                }
            }
        }
    }, [customRouterQuery, globalState, enqueueSnackbar, skip, collectionCurrentUserListPage, router]);

    const checkIfButtonDisplayable = (): boolean => {
        if (collectionInfo === null) {
            return false;
        }
        if (IsAdmin(globalState) === true) {
            return true;
        }
        if (globalState.user === null || collectionInfo.user === null) {
            return false;
        }
        if (collectionInfo.user.username === null) {
            return false;
        }
        return collectionInfo.user.username === globalState.user.username;
    };

    const displayCollectionButton = (collectionInfo: CollectionGetInfoType) => {
        let isPublic = collectionInfo.isPublic;
        let isPublicIcon = <LockOpenOutlinedIcon />;
        let isPublicText = "Put in public";
        let isPublicDialogTitle = "Make the Collection Public ?";
        let isPublicDialogText = "Your Collection will be visible in the search page.";
        if (isPublic === true) {
            isPublicIcon = <LockOutlinedIcon />;
            isPublicText = "Put in private";
            isPublicDialogText = "Your Collection will not be visible in the search page";
            isPublicDialogTitle = "Make your Collection Private";
        }
        const isPublicUpdateValue = isPublic === true ? 0 : 1;
        return (
            <>
                <Grid item xs={12}>
                    <Button
                        loading={loading}
                        icon={<EditIcon />}
                        onClick={() =>
                            router.push(
                                GetFullRoute(CollectionRouteName.EDIT, { id: collectionInfo.id.toString(10), slugName: collectionInfo.slugName })
                            )
                        }
                    >
                        Edit Collection
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    <Dialog
                        name="collection-info-delete-collection"
                        elementTrigger={
                            <Button color="error" loading={loading} icon={<DeleteIcon />}>
                                Delete Collection
                            </Button>
                        }
                        title={`Delete Collection ${collectionInfo.name} ?`}
                        confirm
                        confirmYes={async () => {
                            return CollectionDeleteRequest(collectionInfo.id)
                                .then((res) => {
                                    enqueueSnackbar(res.success, { variant: "success" });
                                    router.push(GetFullRoute(CollectionRouteName.LIST));
                                })
                                .catch((err) => {
                                    enqueueSnackbar(err, { variant: "error" });
                                });
                        }}
                    >
                        <Typography component="p">This action is irreversible !!</Typography>
                    </Dialog>
                </Grid>
                <Grid item xs={12}>
                    <Dialog
                        name="collection-info-update-public"
                        elementTrigger={
                            <Button color="info" loading={loading} icon={isPublicIcon}>
                                {isPublicText}
                            </Button>
                        }
                        title={isPublicDialogTitle}
                        confirm
                        confirmYes={async () => {
                            setLoading(true);
                            return CollectionUpdatePublicFromIdRequest(collectionInfo.id, isPublicUpdateValue)
                                .then((res) => {
                                    setCollectionInfo(res.data.collection);
                                })
                                .catch((err) => {
                                    enqueueSnackbar(err, { variant: "error" });
                                })
                                .finally(() => {
                                    setLoading(false);
                                });
                        }}
                    >
                        <Typography component="p">{isPublicDialogText}</Typography>
                    </Dialog>
                </Grid>
            </>
        );
    };

    const displayCollectionInfo = (collectionInfo: CollectionGetInfoType) => {
        return (
            <>
                <Grid item xs={12}>
                    <Typography component="p">
                        <span className={classes.deckTitle}>{collectionInfo.name}</span>
                        <span>{` by ${collectionInfo.user.username}`}</span>
                        {collectionInfo.isPublic === true ? (
                            <LockOpenOutlinedIcon className={classes.deckIcon} />
                        ) : (
                            <LockOutlinedIcon className={classes.deckIcon} />
                        )}
                    </Typography>
                    <Typography component="p">
                        <span style={{ fontWeight: "bolder" }}>{`${collectionInfo.cardCardCollectionNumber} ${Pluralize(
                            "card",
                            collectionInfo.cardCardCollectionNumber
                        )}`}</span>
                        {` in this collection`}
                    </Typography>
                </Grid>
                {mediaQueryUpMd === false && checkIfButtonDisplayable() === true ? displayCollectionButton(collectionInfo) : null}
                <DisplayCollectionCard cardCollection={collectionInfo} />
            </>
        );
    };

    const displayCollectionTotalInfo = (collectionInfo: CollectionGetInfoType) => {
        return mediaQueryUpMd === true ? (
            <>
                <Grid item xs={12} md={9} container spacing={2}>
                    {displayCollectionInfo(collectionInfo)}
                </Grid>
                <Grid item xs={12} md={3} container spacing={2} className={genericClasses.positionSticky} sx={{ height: "fit-content" }}>
                    {displayCollectionButton(collectionInfo)}
                </Grid>
            </>
        ) : checkIfButtonDisplayable() === true ? (
            <Grid item xs={12} container spacing={2}>
                {displayCollectionInfo(collectionInfo)}
            </Grid>
        ) : null;
    };

    return (
        <DashboardHome active={4} title="Collection info Page">
            <Grid container spacing={2} sx={{ marginTop: (theme) => theme.spacing(1), height: "100%" }}>
                {loading === true ? (
                    <Grid item xs={12}>
                        <Skeleton animation="wave" variant="rounded" width="100%" height="50vh" />
                    </Grid>
                ) : collectionInfo !== null ? (
                    displayCollectionTotalInfo(collectionInfo)
                ) : (
                    <Grid item xs={12} sx={{ height: "100%" }}>
                        <Typography component="p">Collection not found, maybe the url is broken ?</Typography>
                    </Grid>
                )}
            </Grid>
        </DashboardHome>
    );
}
