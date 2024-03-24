import { useState, useEffect, useContext, useMemo, useCallback } from "react";
import { useTheme, Theme, Grid, Skeleton, Typography, useMediaQuery } from "@mui/material";
import { StoreContext } from "@app/lib/state-provider";
import useRouterQuery from "@app/hooks/useRouterQuery";
import GenericStyles from "@app/css/style";
import { useSnackbar } from "notistack";
import { useRouter } from "next/router";
import { DeckRouteName, GetFullRoute } from "@routes/Deck";
import { makeStyles } from "@mui/styles";
import DeckGetInfoRequest from "@api/Deck/GetInfo";
import DashboardHome from "@components/dashboard/Home";
import { DeckGetInfoType } from "@app/types/entity/Deck";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@components/field/Button";
import { IsAdmin } from "@utils/Role";
import Dialog from "@components/display/Dialog";
import DeckDeleteFromIdRequest from "@api/Deck/Delete";
import DeckUpdatePublicFromIdRequest from "@api/Deck/UpdatePublic";
import { DeckCardFieldType, DeckCardType, DeckInfoType } from "@app/types/Deck";
import DisplayDeckCard from "@components/deck/DisplayCard";
import { CardDeckGetInfoType } from "@app/types/Entity";
import { Sort as CardSort } from "@utils/CardSort";
import { CardSearchType } from "@app/types/entity/Card";
import { CreateArrayNumber } from "@utils/Array";

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
    const customRouterQuery = useRouterQuery(router.query);
    const Theme = useTheme();
    const mediaQueryUpMd = useMediaQuery(Theme.breakpoints.up("md"));
    const [deckInfo, setDeckInfo] = useState<DeckGetInfoType | null>(null);
    const [deckCard, setDeckCard] = useState<DeckInfoType>({
        [DeckCardFieldType.MAIN_DECK]: [],
        [DeckCardFieldType.EXTRA_DECK]: [],
        [DeckCardFieldType.SIDE_DECK]: [],
    });
    const [deckCardClassic, setDeckCardClassic] = useState<DeckCardType>({
        [DeckCardFieldType.MAIN_DECK]: [],
        [DeckCardFieldType.EXTRA_DECK]: [],
        [DeckCardFieldType.SIDE_DECK]: [],
    });
    const [loading, setLoading] = useState(true);
    const [skip, setSkip] = useState(false);
    const deckCurrentUserListPage = useMemo(() => GetFullRoute(DeckRouteName.LIST), []);
    const queryKeyName = "info";
    const transformDeckInfoToDeckClassic = useCallback((deckInfo: DeckGetInfoType | null): DeckCardType => {
        if (deckInfo === null) {
            return {
                [DeckCardFieldType.MAIN_DECK]: [],
                [DeckCardFieldType.EXTRA_DECK]: [],
                [DeckCardFieldType.SIDE_DECK]: [],
            };
        }
        const transformCardDeckClassic = (array: CardDeckGetInfoType[]): CardSearchType[] => {
            let newArray: CardSearchType[] = [];
            array.forEach((v) => {
                const { nbCopie, cards } = v;
                let newCardInfo = cards[0];
                const arrayNumber = CreateArrayNumber(0, nbCopie - 1);
                newCardInfo.picture = newCardInfo.pictures[0];
                for (let i = 0; i < arrayNumber.length; i++) {
                    newArray.push(newCardInfo);
                }
            });
            return newArray;
        };
        return {
            [DeckCardFieldType.MAIN_DECK]: CardSort(transformCardDeckClassic(deckInfo.cardMainDecks)),
            [DeckCardFieldType.EXTRA_DECK]: CardSort(transformCardDeckClassic(deckInfo.cardExtraDecks)),
            [DeckCardFieldType.SIDE_DECK]: CardSort(transformCardDeckClassic(deckInfo.cardSideDecks)),
        };
    }, []);
    const transformDeckInfoToDeckCard = useCallback((deckInfo: DeckGetInfoType | null): DeckInfoType => {
        if (deckInfo === null) {
            return {
                [DeckCardFieldType.MAIN_DECK]: [],
                [DeckCardFieldType.EXTRA_DECK]: [],
                [DeckCardFieldType.SIDE_DECK]: [],
            };
        }
        const transformCardDeck = (array: CardDeckGetInfoType[]): CardDeckGetInfoType[] => {
            let newArray: CardDeckGetInfoType[] = [];
            array.forEach((v) => {
                let newCardInfo = v.cards[0];
                newCardInfo.picture = newCardInfo.pictures[0];
                newArray.push({ ...v, cards: [newCardInfo] });
            });
            return newArray;
        };
        return {
            [DeckCardFieldType.MAIN_DECK]: transformCardDeck(deckInfo.cardMainDecks),
            [DeckCardFieldType.EXTRA_DECK]: transformCardDeck(deckInfo.cardExtraDecks),
            [DeckCardFieldType.SIDE_DECK]: transformCardDeck(deckInfo.cardSideDecks),
        };
    }, []);
    const handleGetDeckInfoReq = useCallback(
        (resData: DeckGetInfoType | null) => {
            setDeckInfo(resData);
            const transformedResData = transformDeckInfoToDeckCard(resData);
            const transformedResDataClassic = transformDeckInfoToDeckClassic(resData);
            if (transformedResData !== null) {
                setDeckCard(transformedResData);
            }
            if (transformedResDataClassic !== null) {
                setDeckCardClassic(transformedResDataClassic);
            }
        },
        [transformDeckInfoToDeckClassic, transformDeckInfoToDeckCard]
    );

    useEffect(() => {
        if (globalState.user !== null && customRouterQuery.loading === false && skip === false) {
            const { query } = customRouterQuery;
            const queryKeyArray = Object.keys(query);
            if (queryKeyArray.length === 0 || queryKeyArray.includes(queryKeyName) === false) {
                router.push(deckCurrentUserListPage);
            } else {
                const queryInfoArray = query[queryKeyName] as string[];
                if (queryInfoArray.length === 0) {
                    router.push(deckCurrentUserListPage);
                }
                let deckId = null;
                for (let i = 0; i < queryInfoArray.length; i++) {
                    const el = queryInfoArray[i];
                    const elInt = parseInt(el, 10);
                    if (Number.isNaN(elInt) === false) {
                        deckId = elInt;
                        break;
                    }
                }
                if (deckId === null) {
                    setLoading(false);
                    setSkip(true);
                } else {
                    DeckGetInfoRequest(deckId)
                        .then((res) => {
                            handleGetDeckInfoReq(res.data.deck);
                        })
                        .catch((err) => enqueueSnackbar(err, { variant: "error" }))
                        .finally(() => {
                            setLoading(false);
                            setSkip(true);
                        });
                }
            }
        }
    }, [customRouterQuery, globalState, enqueueSnackbar, skip, deckCurrentUserListPage, router, handleGetDeckInfoReq]);

    const checkIfButtonDisplayable = (): boolean => {
        if (deckInfo === null) {
            return false;
        }
        if (IsAdmin(globalState) === true) {
            return true;
        }
        if (globalState.user === null || deckInfo.user === null) {
            return false;
        }
        if (deckInfo.user.username === null) {
            return false;
        }
        return deckInfo.user.username === globalState.user.username;
    };

    const displayDeckButton = (deckInfo: DeckGetInfoType) => {
        let isPublic = deckInfo.isPublic;
        let isPublicIcon = <LockOpenOutlinedIcon />;
        let isPublicText = "Put in public";
        let isPublicDialogTitle = "Make the Deck Public ?";
        let isPublicDialogText = "Your Deck will be visible in the search page.";
        if (isPublic === true) {
            isPublicIcon = <LockOutlinedIcon />;
            isPublicText = "Put in private";
            isPublicDialogText = "Your Deck will not be visible in the search page";
            isPublicDialogTitle = "Make your Deck Private";
        }
        const isPublicUpdateValue = isPublic === true ? 0 : 1;
        return (
            <>
                <Grid item xs={12}>
                    <Button
                        loading={loading}
                        icon={<EditIcon />}
                        onClick={() => router.push(GetFullRoute(DeckRouteName.EDIT, { id: deckInfo.id.toString(10), slugName: deckInfo.slugName }))}
                    >
                        Edit Deck
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    <Dialog
                        name="deck-info-delete-deck"
                        elementTrigger={
                            <Button color="error" loading={loading} icon={<DeleteIcon />}>
                                Delete Deck
                            </Button>
                        }
                        title={`Delete Deck ${deckInfo.name} ?`}
                        confirm
                        confirmYes={async () => {
                            return DeckDeleteFromIdRequest(deckInfo.id)
                                .then((res) => {
                                    enqueueSnackbar(res.success, { variant: "success" });
                                    router.push(GetFullRoute(DeckRouteName.LIST));
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
                        name="deck-info-update-public"
                        elementTrigger={
                            <Button color="info" loading={loading} icon={isPublicIcon}>
                                {isPublicText}
                            </Button>
                        }
                        title={isPublicDialogTitle}
                        confirm
                        confirmYes={async () => {
                            setLoading(true);
                            return DeckUpdatePublicFromIdRequest(deckInfo.id, isPublicUpdateValue)
                                .then((res) => {
                                    handleGetDeckInfoReq(res.data.deck);
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

    const displayDeckInfo = (deckInfo: DeckGetInfoType) => {
        return (
            <>
                <Grid item xs={12}>
                    <Typography component="p">
                        <span className={classes.deckTitle}>{deckInfo.name}</span>
                        <span>{` by ${deckInfo.user.username}`}</span>
                        {deckInfo.isPublic === true ? (
                            <LockOpenOutlinedIcon className={classes.deckIcon} />
                        ) : (
                            <LockOutlinedIcon className={classes.deckIcon} />
                        )}
                    </Typography>
                </Grid>
                {mediaQueryUpMd === false && checkIfButtonDisplayable() === true ? displayDeckButton(deckInfo) : null}
                <Grid item xs={12} container spacing={2}>
                    <DisplayDeckCard deckCard={deckCardClassic} displayRemoveIcon={true} redirectToCardInfoPage={true} />
                </Grid>
            </>
        );
    };

    const displayDeckTotalInfo = (deckInfo: DeckGetInfoType) => {
        return mediaQueryUpMd === true ? (
            <>
                <Grid item xs={12} md={9} container spacing={2}>
                    {displayDeckInfo(deckInfo)}
                </Grid>
                <Grid item xs={12} md={3} container spacing={2} className={genericClasses.positionSticky} sx={{ height: "fit-content" }}>
                    {displayDeckButton(deckInfo)}
                </Grid>
            </>
        ) : checkIfButtonDisplayable() === true ? (
            <Grid item xs={12} container spacing={2}>
                {displayDeckInfo(deckInfo)}
            </Grid>
        ) : null;
    };

    return (
        <DashboardHome active={3} title="Deck info Page">
            <Grid container spacing={2} sx={{ marginTop: (theme) => theme.spacing(1), height: "100%" }}>
                {loading === true ? (
                    <Grid item xs={12}>
                        <Skeleton animation="wave" variant="rounded" width="100%" height="50vh" />
                    </Grid>
                ) : deckInfo !== null ? (
                    displayDeckTotalInfo(deckInfo)
                ) : (
                    <Grid item xs={12} sx={{ height: "100%" }}>
                        <Typography component="p">Deck not found, maybe the url is broken ?</Typography>
                    </Grid>
                )}
            </Grid>
        </DashboardHome>
    );
}
