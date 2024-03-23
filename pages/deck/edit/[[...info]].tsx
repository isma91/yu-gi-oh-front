import { useState, useEffect, useContext } from "react";
import { useTheme, Grid, Skeleton, Typography } from "@mui/material";
import { StoreContext } from "@app/lib/state-provider";
import useRouterQuery from "@app/hooks/useRouterQuery";
import { useSnackbar } from "notistack";
import { useRouter } from "next/router";
import { DeckRouteName, GetFullRoute } from "@routes/Deck";
import DeckGetInfoRequest from "@api/Deck/GetInfo";
import DashboardHome from "@components/dashboard/Home";
import { DeckGetInfoType } from "@app/types/entity/Deck";
import { DeckCardFieldType, DeckCardType } from "@app/types/Deck";
import { CardDeckGetInfoType } from "@app/types/Entity";
import DeckEditForm from "@form/deck/edit";
import { CardSearchType } from "@app/types/entity/Card";
import { CreateArrayNumber } from "@utils/Array";
import DeckSearchCard from "@components/deck/SearchCard";
import DisplayDeck from "@components/deck/DisplayDeck";
import { IsAdmin } from "@utils/Role";

export default function DeckEditPage() {
    const { state: globalState } = useContext(StoreContext);
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const { query, loading: loadingRouterQuery } = useRouterQuery(router.query);
    const Theme = useTheme();
    const limitArray: number[] = [15, 30, 45, 60];
    const [deckInfo, setDeckInfo] = useState<DeckGetInfoType | null>(null);
    const [deckCard, setDeckCard] = useState<DeckCardType>({
        [DeckCardFieldType.MAIN_DECK]: [],
        [DeckCardFieldType.EXTRA_DECK]: [],
        [DeckCardFieldType.SIDE_DECK]: [],
    });
    const [openCardDialog, setOpenCardDialog] = useState<boolean>(false);
    const [cardDialogInfo, setCardDialogInfo] = useState<CardSearchType | null>(null);
    const [autoClick, setAutoClick] = useState<boolean>(true);
    const [loading, setLoading] = useState(true);
    const queryKeyName = "info";

    const redirectToDeckCurrentListPage = () => {
        router.push(GetFullRoute(DeckRouteName.LIST));
    };

    const transformCardDeck = (array: CardDeckGetInfoType[]): CardSearchType[] => {
        let newArray: CardSearchType[] = [];
        array.forEach((v) => {
            const { nbCopie, cards } = v;
            const newCardInfo = { ...cards[0], picture: cards[0].pictures[0] };
            const arrayNumber = CreateArrayNumber(0, nbCopie - 1);
            for (let i = 0; i < arrayNumber.length; i++) {
                newArray.push(newCardInfo);
            }
        });
        return newArray;
    };

    const transformToDeckInfo = (deckInfo: DeckGetInfoType | null): DeckCardType | null => {
        if (deckInfo === null) {
            return null;
        }
        return {
            [DeckCardFieldType.MAIN_DECK]: transformCardDeck(deckInfo.cardMainDecks),
            [DeckCardFieldType.EXTRA_DECK]: transformCardDeck(deckInfo.cardExtraDecks),
            [DeckCardFieldType.SIDE_DECK]: transformCardDeck(deckInfo.cardSideDecks),
        };
    };

    const getDeckInfoReq = async (id: number) => {
        return DeckGetInfoRequest(id)
            .then((res) => {
                const resData = res.data.deck;
                if (
                    resData !== null &&
                    globalState.user !== null &&
                    (IsAdmin(globalState) === true || globalState.user.username === resData.user.username)
                ) {
                    setDeckInfo(resData);
                    const transformedResData = transformToDeckInfo(resData);
                    if (transformedResData !== null) {
                        setDeckCard(transformedResData);
                    }
                }
            })
            .catch((err) => enqueueSnackbar(err, { variant: "error" }))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        if (globalState.user !== null && loadingRouterQuery === false) {
            const queryKeyArray = Object.keys(query);
            if (queryKeyArray.length === 0 || queryKeyArray.includes(queryKeyName) === false) {
                redirectToDeckCurrentListPage();
            } else {
                const queryInfoArray = query[queryKeyName] as string[];
                if (queryInfoArray.length === 0) {
                    redirectToDeckCurrentListPage();
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
                } else {
                    getDeckInfoReq(deckId);
                }
            }
        }
    }, [loadingRouterQuery, globalState]);

    return (
        <DashboardHome active={3} title="Deck edit Page">
            <Grid item xs={12} container spacing={4}>
                {loading === true ? (
                    <Grid item xs={12}>
                        <Skeleton animation="wave" variant="rounded" width="100%" height="50vh" />
                    </Grid>
                ) : deckInfo !== null ? (
                    <>
                        <Grid item xs={12} md={6} container sx={{ height: "fit-content" }}>
                            <Grid item xs={12}>
                                <DeckEditForm deckCard={deckCard} deckInfo={deckInfo} />
                            </Grid>
                            <Grid item xs={12} sx={{ marginTop: Theme.spacing(2) }} container spacing={2}>
                                <DisplayDeck
                                    deckCardState={[deckCard, setDeckCard]}
                                    openDialogState={[openCardDialog, setOpenCardDialog]}
                                    autoClickState={[autoClick, setAutoClick]}
                                    cardDialogInfoState={[cardDialogInfo, setCardDialogInfo]}
                                />
                            </Grid>
                        </Grid>
                        <Grid item xs={12} md={6} container spacing={2} sx={{ height: "fit-content" }}>
                            <DeckSearchCard
                                openDialogState={[openCardDialog, setOpenCardDialog]}
                                limitArray={limitArray}
                                autoClick={autoClick}
                                setCardDialogInfo={setCardDialogInfo}
                            />
                        </Grid>
                    </>
                ) : (
                    <Grid item xs={12} sx={{ height: "100%" }}>
                        <Typography component="p">Deck not found, maybe the url is broken ?</Typography>
                    </Grid>
                )}
            </Grid>
        </DashboardHome>
    );
}
