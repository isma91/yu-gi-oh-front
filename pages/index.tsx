import { useState, useEffect, useContext, useMemo } from "react";
import { UserGetBasicInfoType, UserGetBasicInfoDeckType, UserGetBasicInfoCollectionType } from "@app/types/entity/User";
import DashboardHome from "@components/dashboard/Home";
import { useSnackbar } from "notistack";
import { StoreContext } from "@app/lib/state-provider";
import UserGetBasicInfoRequest from "@api/User/GetBasicInfo";
import { Grid, Skeleton, Typography, useTheme, Theme, Paper } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { AddApiBaseUrl, GetDefaultCardPicturePath } from "@utils/Url";
import { DeckCardFieldType, DeckCardNumberPerFieldTypeType } from "@app/types/Deck";
import { FindAllDeckCardWarning } from "@utils/DeckCard";
import { Pluralize } from "@utils/String";
import { DeckRouteName, GetFullRoute as DeckGetFullRoute } from "@routes/Deck";
import { CollectionRouteName, GetFullRoute as CollectionGetFullRoute } from "@routes/Collection";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import Alert from "@components/feedback/Alert";

type DeckInfoType = UserGetBasicInfoDeckType & {
    artwork: string;
    texts: string[];
    warnings: string[];
};

type CollectionInfoType = UserGetBasicInfoCollectionType & {
    artwork: string;
};

const useStyles = makeStyles((theme: Theme) => ({
    deckPicture: {
        width: "100%",
        objectFit: "cover",
        height: "150px",
    },
    deckTitle: {
        fontSize: "1.2rem",
        fontWeight: "bolder",
        textAlign: "center",
    },
    deckIcon: {
        verticalAlign: "text-bottom",
    },
}));

export default function Home() {
    const { state: globalState } = useContext(StoreContext);
    const { enqueueSnackbar } = useSnackbar();
    const Theme = useTheme();
    const router = useRouter();
    const classes = useStyles();
    const [userInfo, setUserInfo] = useState<UserGetBasicInfoType | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [skip, setSkip] = useState<boolean>(false);
    const userDeckArray: DeckInfoType[] = useMemo(() => {
        if (userInfo !== null && userInfo.decks.length !== 0) {
            let newDeckArray: DeckInfoType[] = [];
            userInfo.decks.forEach((deckInfo) => {
                let artwork: string;
                if (deckInfo.artworkUrl !== null) {
                    artwork = AddApiBaseUrl(deckInfo.artworkUrl);
                } else {
                    artwork = GetDefaultCardPicturePath();
                }
                let textArray: string[] = [];
                let deckInfoNumberPerFielTypeJson: DeckCardNumberPerFieldTypeType = {
                    [DeckCardFieldType.MAIN_DECK]: 0,
                    [DeckCardFieldType.EXTRA_DECK]: 0,
                    [DeckCardFieldType.SIDE_DECK]: 0,
                };
                if (deckInfo.cardMainDeckNumber > 0) {
                    textArray.push(
                        `${DeckCardFieldType.MAIN_DECK}: ${deckInfo.cardMainDeckNumber} ${Pluralize("card", deckInfo.cardMainDeckNumber)}`
                    );
                    deckInfoNumberPerFielTypeJson[DeckCardFieldType.MAIN_DECK] = deckInfo.cardMainDeckNumber;
                }
                if (deckInfo.cardExtraDeckNumber > 0) {
                    textArray.push(
                        `${DeckCardFieldType.EXTRA_DECK}: ${deckInfo.cardExtraDeckNumber} ${Pluralize("card", deckInfo.cardExtraDeckNumber)}`
                    );
                    deckInfoNumberPerFielTypeJson[DeckCardFieldType.EXTRA_DECK] = deckInfo.cardExtraDeckNumber;
                }
                if (deckInfo.cardSideDeckNumber > 0) {
                    textArray.push(
                        `${DeckCardFieldType.SIDE_DECK}: ${deckInfo.cardSideDeckNumber} ${Pluralize("card", deckInfo.cardSideDeckNumber)}`
                    );
                    deckInfoNumberPerFielTypeJson[DeckCardFieldType.SIDE_DECK] = deckInfo.cardSideDeckNumber;
                }
                newDeckArray.push({
                    ...deckInfo,
                    artwork: artwork,
                    texts: textArray,
                    warnings: FindAllDeckCardWarning(deckInfoNumberPerFielTypeJson),
                });
            });
            return newDeckArray;
        }
        return [];
    }, [userInfo]);
    const userCollectionArray: CollectionInfoType[] = useMemo(() => {
        if (userInfo !== null && userInfo.cardCollections.length !== 0) {
            let newUserCollectionArray: CollectionInfoType[] = [];
            userInfo.cardCollections.forEach((cardCollection) => {
                let artwork: string;
                if (cardCollection.artworkUrl !== null) {
                    artwork = AddApiBaseUrl(cardCollection.artworkUrl);
                } else {
                    artwork = GetDefaultCardPicturePath();
                }
                newUserCollectionArray.push({ ...cardCollection, artwork: artwork });
            });
            return newUserCollectionArray;
        }
        return [];
    }, [userInfo]);

    useEffect(() => {
        if (globalState.user !== null && skip === false) {
            UserGetBasicInfoRequest()
                .then((res) => setUserInfo(res.data.user))
                .catch((err) => enqueueSnackbar(err, { variant: "error" }))
                .finally(() => {
                    setLoading(false);
                    setSkip(true);
                });
        }
    }, [globalState, skip, enqueueSnackbar]);

    const displayUserDeck = (decks: DeckInfoType[]) => {
        return decks.map((deckInfo, userDeckKey) => {
            const { id, name, slugName, artwork, isPublic, texts, warnings } = deckInfo;
            const gridKey = `userDeckInfoHomePage-${id}-${slugName}-${userDeckKey}`;
            return (
                <Grid
                    key={gridKey}
                    item
                    xs={12}
                    md={3}
                    container
                    spacing={2}
                    sx={{
                        cursor: "pointer",
                        marginLeft: Theme.spacing(2),
                        marginTop: Theme.spacing(1),
                        padding: `${Theme.spacing(0)} !important`,
                    }}
                    onClick={() => router.push(DeckGetFullRoute(DeckRouteName.INFO, { id: id.toString(10), slugName: slugName }))}
                >
                    <Paper elevation={1} sx={{ width: "100%" }}>
                        <Grid item xs={12}>
                            <Image
                                src={artwork}
                                width={0}
                                height={0}
                                sizes="100vw"
                                alt={`Deck ${deckInfo.name} artwork`}
                                className={classes.deckPicture}
                            />
                        </Grid>
                        <Grid item xs={12} sx={{ textAlign: "center" }}>
                            <Typography component="span">
                                <span className={classes.deckTitle}>{name}</span>
                                {isPublic ? <LockOpenOutlinedIcon className={classes.deckIcon} /> : <LockOutlinedIcon className={classes.deckIcon} />}
                            </Typography>
                        </Grid>
                        {warnings.length > 0 ? (
                            <Grid item xs={12} sx={{ marginTop: Theme.spacing(1) }}>
                                {warnings.map((warning, warningKey) => {
                                    return <Alert key={`${gridKey}-warning-${warningKey}`} severity="warning" message={warning} />;
                                })}
                            </Grid>
                        ) : null}
                        {texts.length > 0 ? (
                            <Grid item xs={12} sx={{ paddingLeft: Theme.spacing(2), marginTop: Theme.spacing(1) }}>
                                {texts.map((text, textKey) => {
                                    return (
                                        <Typography key={`${gridKey}-text-${textKey}`} component="p">
                                            {text}
                                        </Typography>
                                    );
                                })}
                            </Grid>
                        ) : null}
                    </Paper>
                </Grid>
            );
        });
    };

    const displayUserCollection = (collections: CollectionInfoType[]) => {
        return collections.map((collection, collectionKey) => {
            const { id, name, slugName, isPublic, artwork, cardCardCollectionNumber } = collection;
            const gridKey = `userCollectionInfoHomePage-${id}-${slugName}-${collectionKey}`;
            return (
                <Grid
                    key={gridKey}
                    item
                    xs={12}
                    md={3}
                    container
                    spacing={2}
                    sx={{
                        cursor: "pointer",
                        marginLeft: Theme.spacing(2),
                        marginTop: Theme.spacing(1),
                        padding: `${Theme.spacing(0)} !important`,
                    }}
                    onClick={() => router.push(CollectionGetFullRoute(CollectionRouteName.INFO, { id: id.toString(10), slugName: slugName }))}
                >
                    <Paper elevation={1} sx={{ width: "100%" }}>
                        <Grid item xs={12}>
                            <Image src={artwork} width={0} height={0} sizes="100vw" alt={`Deck ${name} artwork`} className={classes.deckPicture} />
                        </Grid>
                        <Grid item xs={12} sx={{ textAlign: "center" }}>
                            <Typography component="span">
                                <span className={classes.deckTitle}>{name}</span>
                                {isPublic ? <LockOpenOutlinedIcon className={classes.deckIcon} /> : <LockOutlinedIcon className={classes.deckIcon} />}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sx={{ paddingLeft: Theme.spacing(2) }}>
                            <Typography component="span">
                                <span style={{ fontWeight: "bolder" }}>{`${cardCardCollectionNumber} ${Pluralize(
                                    "card",
                                    cardCardCollectionNumber
                                )}`}</span>
                                {` in this collection`}
                            </Typography>
                        </Grid>
                    </Paper>
                </Grid>
            );
        });
    };

    const displayUserInfo = (userInfo: UserGetBasicInfoType) => {
        const userDeckNumber = userDeckArray.length;
        const userCollectionNumber = userCollectionArray.length;
        return (
            <>
                <Grid item xs={12}>
                    <Typography component="p">{`Welcome back ${userInfo.username} !!`}</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography component="p">
                        {`Dear duelist, `}
                        {userDeckNumber === 0 ? (
                            <>
                                {`you don't have a deck yet !! Click `}
                                <Link href={DeckGetFullRoute(DeckRouteName.CREATE)}>here</Link>
                                {` to create to new one.`}
                            </>
                        ) : (
                            `you have a total of ${userDeckNumber} ${Pluralize("deck", userDeckNumber)} !!`
                        )}
                    </Typography>
                </Grid>
                {userDeckNumber > 0 ? (
                    <Grid item xs={12} container spacing={2} sx={{ marginTop: Theme.spacing(2) }}>
                        {displayUserDeck(userDeckArray)}
                    </Grid>
                ) : null}
                <Grid item xs={12} sx={{ marginTop: Theme.spacing(2) }}>
                    <Typography component="p">
                        {`Dear duelist, `}
                        {userCollectionNumber === 0 ? (
                            <>
                                {`you don't have a collection yet !! Click `}
                                <Link href={CollectionGetFullRoute(CollectionRouteName.CREATE)}>here</Link>
                                {` to create to new one.`}
                            </>
                        ) : (
                            `you have a total of ${userCollectionNumber} ${Pluralize("collection", userCollectionNumber)} !!`
                        )}
                    </Typography>
                </Grid>
                {userCollectionNumber > 0 ? (
                    <Grid item xs={12} container spacing={2} sx={{ marginTop: Theme.spacing(2) }}>
                        {displayUserCollection(userCollectionArray)}
                    </Grid>
                ) : null}
            </>
        );
    };

    return (
        <DashboardHome active={0} title="Home page">
            <Grid container spacing={2} sx={{ marginTop: Theme.spacing(1), height: "100%" }}>
                {loading === true ? (
                    <Grid item xs={12}>
                        <Skeleton animation="wave" variant="rounded" width="100%" height="50vh" />
                    </Grid>
                ) : userInfo !== null ? (
                    displayUserInfo(userInfo)
                ) : (
                    <Grid item xs={12} sx={{ height: "100%" }}>
                        <Typography component="p">User info with deck not found...</Typography>
                    </Grid>
                )}
            </Grid>
        </DashboardHome>
    );
}
