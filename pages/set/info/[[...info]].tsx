import { useState, useEffect, useContext } from "react";
import { useTheme, Theme, Grid, Skeleton, Typography } from "@mui/material";
import { StoreContext } from "@app/lib/state-provider";
import useRouterQuery from "@app/hooks/useRouterQuery";
import { useSnackbar } from "notistack";
import { useRouter } from "next/router";
import { SetRouteName, GetFullRoute as SetGetFullRoute } from "@routes/Set";
import { makeStyles } from "@mui/styles";
import DashboardHome from "@components/dashboard/Home";
import SetGetInfoRequest from "@api/Set/GetInfo";
import { SetSearchType } from "@app/types/entity/Set";
import { RarityGetAllType } from "@app/types/entity/Rarity";
import { CardSetGetAllType } from "@app/types/entity/CardSet";
import { CardSearchType } from "@app/types/entity/Card";
import { GetFormat } from "@utils/Date";
import { DateFormatTypeType } from "@app/types/Date";
import { SortCheckEl } from "@utils/CardSort";
import { CardInfoToDisplayType } from "@app/types/SearchCard";
import SearchCardPopover from "@components/search/CardPopover";
import Collapse from "@components/display/Collapse";
import { GetCardPictureUrl } from "@utils/SearchCard";
import { RedirectToNewTab } from "@utils/Route";
import { GetFullRoute as CardGetFullRoute, CardRouteName } from "@routes/Card";

const useStyles = makeStyles((theme: Theme) => ({
    cardPicturePictureView: {
        objectFit: "contain",
        height: "200px",
        "&:hover": {
            cursor: "pointer",
        },
    },
}));

type SetInfoType = SetSearchType & {
    cardFromRarity: {
        [key in number]: {
            rarity: RarityGetAllType;
            cardSets: Array<
                Omit<CardSetGetAllType, "sets"> & {
                    card: CardSearchType;
                }
            >;
        };
    };
};

export default function DeckInfoPage() {
    const { state: globalState } = useContext(StoreContext);
    const router = useRouter();
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();
    const { query, loading: loadingRouterQuery } = useRouterQuery(router.query);
    const Theme = useTheme();
    const [setInfo, setSetInfo] = useState<SetInfoType | null>(null);
    const [loading, setLoading] = useState(true);
    const [anchorEl, setAnchorEl] = useState<HTMLImageElement | null>(null);
    const [cardInfoToDisplay, setCardInfoToDisplay] = useState<CardInfoToDisplayType | null>(null);
    const openPopover = Boolean(anchorEl);
    const queryKeyName = "info";

    const handlePopoverClose = () => {
        setAnchorEl(null);
        setCardInfoToDisplay(null);
    };

    const redirectToSetSearchPage = () => {
        router.push(SetGetFullRoute(SetRouteName.SEARCH));
    };

    const sendSetGetInfoReq = async (id: number) => {
        return SetGetInfoRequest(id)
            .then((res) => {
                const resData = res.data.set;
                if (resData !== null) {
                    const { cardSets, ...rest } = resData;
                    let cardFromRarity: {
                        [key in number]: {
                            rarity: RarityGetAllType;
                            cardSets: Array<
                                Omit<CardSetGetAllType, "sets"> & {
                                    card: CardSearchType;
                                }
                            >;
                        };
                    } = {};
                    for (let i = 0; i < cardSets.length; i++) {
                        const el = cardSets[i];
                        const rarity = el.rarities[0];
                        if (cardFromRarity[rarity.id] === undefined) {
                            cardFromRarity[rarity.id] = { rarity: { ...rarity }, cardSets: [{ ...el }] };
                        } else {
                            cardFromRarity[rarity.id].cardSets.push({ ...el });
                        }
                    }
                    setSetInfo({ ...rest, cardFromRarity: cardFromRarity });
                }
            })
            .catch((err) => enqueueSnackbar(err, { variant: "error" }))
            .finally(() => setLoading(false));
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
                    sendSetGetInfoReq(setId);
                }
            }
        }
    }, [loadingRouterQuery, globalState]);

    const handleClick = (cardInfo: CardSearchType) => {
        const { uuid, slugName } = cardInfo;
        const option = {
            uuid: uuid,
            slugName: slugName,
        };
        const url = CardGetFullRoute(CardRouteName.INFO, option);
        RedirectToNewTab(router, url);
    };

    const displayCardFromRarity = (cardInfoFromRarityArray: SetInfoType["cardFromRarity"]) => {
        const cardFromRarityKeyArray = Object.keys(cardInfoFromRarityArray).map((v) => parseInt(v, 10));
        return cardFromRarityKeyArray.map((rarityId, rarityKey) => {
            const { cardSets, rarity } = cardInfoFromRarityArray[rarityId];
            const cardSetsSorted = cardSets.sort((a, b) => {
                let aCode: string | null = a.code;
                let bCode: string | null = b.code;
                const checkEl = SortCheckEl(aCode, bCode);
                if (checkEl !== null) {
                    return checkEl;
                }
                aCode = aCode as string;
                bCode = bCode as string;
                return aCode.localeCompare(bCode);
            });
            const cardFromRarityKey = `cardFromRarity-${rarityId}-${rarityKey}`;
            return (
                <Grid
                    key={cardFromRarityKey}
                    item
                    xs={12}
                    container
                    spacing={0}
                    justifyContent="center"
                    sx={{ marginRight: Theme.spacing(2), marginTop: Theme.spacing(2) }}
                >
                    <Grid item xs={12} spacing={0} sx={{ textAlign: "center" }}>
                        <Collapse
                            initialValue={false}
                            triggerElement={
                                <Typography component="span" sx={{ fontWeight: "bolder", fontSize: "1.1rem" }}>
                                    {`${rarity.name} (${cardSetsSorted.length} card(s))`}
                                </Typography>
                            }
                        >
                            <Grid item xs={12} container spacing={2}>
                                {cardSetsSorted.map((cardSet, cardSetKey) => {
                                    const { card: cardInfo } = cardSet;
                                    const cardGridKey = `${cardFromRarityKey}-${cardInfo.id}-${cardSetKey}`;
                                    const pictureUrl = GetCardPictureUrl(cardInfo);
                                    const popoverId = `popover-${cardGridKey}`;
                                    const cardInfoToDisplayJson: CardInfoToDisplayType = {
                                        cardInfo: cardInfo,
                                        popoverId: popoverId,
                                    };
                                    let cardSetCodeWithCardCode = "";
                                    let setCode = "Unknown";
                                    if (setInfo !== null && setInfo.code !== null && setInfo.code !== "") {
                                        setCode = setInfo.code;
                                    }
                                    if (cardSet.code === null || cardSet.code === "") {
                                        cardSetCodeWithCardCode = setCode;
                                    } else {
                                        cardSetCodeWithCardCode = `${setCode}-${cardSet.code}`;
                                    }
                                    return (
                                        <Grid key={cardGridKey} item xs={6} md={3} container spacing={2} sx={{ marginTop: Theme.spacing(2) }}>
                                            <Grid item xs={12}>
                                                <img
                                                    aria-owns={popoverId}
                                                    aria-haspopup="true"
                                                    src={pictureUrl}
                                                    className={classes.cardPicturePictureView}
                                                    onMouseEnter={(e) => {
                                                        setAnchorEl(e.currentTarget);
                                                        setCardInfoToDisplay(cardInfoToDisplayJson);
                                                    }}
                                                    onMouseLeave={handlePopoverClose}
                                                    onClick={(e) => handleClick(cardInfo)}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Typography component="p" sx={{ cursor: "pointer" }} onClick={(e) => handleClick(cardInfo)}>
                                                    {cardSetCodeWithCardCode}
                                                    <br />
                                                    {cardInfo.name}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    );
                                })}
                            </Grid>
                        </Collapse>
                    </Grid>
                </Grid>
            );
        });
    };

    const displaySetInfo = (setInfoData: SetInfoType) => {
        const { nbCard, cardFromRarity } = setInfoData;
        let nameWithCode = setInfoData.name;
        if (setInfoData.code !== "" && setInfoData.code !== null) {
            nameWithCode += ` (${setInfoData.code})`;
        }
        let releaseDate = "Unknown";
        if (setInfoData.releaseDate !== null) {
            releaseDate = GetFormat(setInfoData.releaseDate, DateFormatTypeType.DATE);
        }
        return (
            <Grid item xs={12} container spacing={0} justifyContent="center" sx={{ margin: "auto" }}>
                <Grid item xs={12}>
                    <Typography component="p" sx={{ fontWeight: "bolder", fontSize: "1.2rem", textAlign: "center" }}>
                        {nameWithCode}
                    </Typography>
                    <Typography component="p" sx={{ textAlign: "center" }}>
                        <span>Release date: </span>
                        <span style={{ fontWeight: "bolder" }}>{releaseDate}</span>
                    </Typography>
                    <Typography component="p" sx={{ textAlign: "center" }}>
                        <span style={{ fontWeight: "bolder" }}>{nbCard}</span>
                        <span> Card(s)</span>
                    </Typography>
                </Grid>
                <Grid item xs={12} container spacing={0} justifyContent="center" sx={{ marginTop: Theme.spacing(2) }}>
                    <SearchCardPopover
                        open={openPopover}
                        handleClose={handlePopoverClose}
                        cardInfoToDisplay={cardInfoToDisplay}
                        anchorEl={anchorEl}
                        anchorOriginPositionHorizontal="right"
                        anchorOriginPositionVertical="bottom"
                        transformOriginPositionHorizontal="left"
                        transformOriginPositionVertical="center"
                    />
                    {displayCardFromRarity(cardFromRarity)}
                </Grid>
            </Grid>
        );
    };

    return (
        <DashboardHome active={2} title="Set info Page">
            <Grid container spacing={0} sx={{ marginTop: Theme.spacing(1), height: "100%" }}>
                {loading === true ? (
                    <Grid item xs={12}>
                        <Skeleton animation="wave" variant="rounded" width="100%" height="50vh" />
                    </Grid>
                ) : setInfo !== null ? (
                    displaySetInfo(setInfo)
                ) : (
                    <Grid item xs={12} sx={{ height: "100%" }}>
                        <Typography component="p">Set not found, maybe the url is broken ?</Typography>
                    </Grid>
                )}
            </Grid>
        </DashboardHome>
    );
}
