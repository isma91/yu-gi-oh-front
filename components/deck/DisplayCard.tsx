import { useState } from "react";
import { makeStyles } from "@mui/styles";
import { DeckCardType, DeckCardOpenType, DeckCardFieldType, DeckInfoType } from "@app/types/Deck";
import { useTheme, Grid, Typography, Collapse, Badge, Theme } from "@mui/material";
import { Capitalize } from "@utils/String";
import RemoveIcon from "@mui/icons-material/Remove";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { CardSearchType } from "@app/types/entity/Card";
import { GetCardPictureUrl } from "@utils/SearchCard";
import { CardInfoToDisplayType } from "@app/types/SearchCard";
import SearchCardPopover from "@components/search/CardPopover";
import { CardRouteName, GetFullRoute } from "@routes/Card";
import { RedirectToNewTab } from "@utils/Route";
import { useRouter } from "next/router";
import { CreateArrayNumber } from "@utils/Array";

type DisplayDeckCardPropsType = {
    deckCard: DeckCardType | DeckInfoType;
    displayRemoveIcon?: boolean;
    redirectToCardInfoPage?: boolean;
    handleRemoveCard?: (index: number, fieldType: DeckCardFieldType) => void;
};

const useStyles = makeStyles((theme: Theme) => ({
    cardPicturePictureView: {
        objectFit: "contain",
        height: "200px",
        "&:hover": {
            cursor: "pointer",
        },
    },
}));

export default function DisplayDeckCard(props: DisplayDeckCardPropsType) {
    const { deckCard } = props;
    const classes = useStyles();
    const router = useRouter();
    const [cardInfoToDisplay, setCardInfoToDisplay] = useState<CardInfoToDisplayType | null>(null);
    const [openDeckCard, setOpenDeckCard] = useState<DeckCardOpenType>({
        [DeckCardFieldType.MAIN_DECK]: true,
        [DeckCardFieldType.EXTRA_DECK]: true,
        [DeckCardFieldType.SIDE_DECK]: true,
    });
    const [anchorEl, setAnchorEl] = useState<HTMLImageElement | null>(null);
    const openPopover = Boolean(anchorEl);
    const Theme = useTheme();
    const cardFieldTypeArray = Object.keys(deckCard) as Array<keyof typeof deckCard>;
    let displayRemoveIcon = true;
    if (props.displayRemoveIcon !== undefined) {
        displayRemoveIcon = props.displayRemoveIcon;
    }
    let redirectToCardInfoPage = false;
    if (props.redirectToCardInfoPage !== undefined) {
        redirectToCardInfoPage = props.redirectToCardInfoPage;
    }

    const handlePopoverClose = () => {
        setAnchorEl(null);
        setCardInfoToDisplay(null);
    };

    const handleClick = (cardInfo: CardSearchType) => {
        if (redirectToCardInfoPage === true) {
            const { uuid, slugName } = cardInfo;
            const option = {
                uuid: uuid,
                slugName: slugName,
            };
            const url = GetFullRoute(CardRouteName.CARD_INFO, option);
            RedirectToNewTab(router, url);
        }
    };

    const displayDeckCardPicture = (cardInfo: CardSearchType, fieldType: DeckCardFieldType, key: number, nbCopie: number) => {
        const pictureUrl = GetCardPictureUrl(cardInfo);
        const popoverId = `popover-${fieldType}-cardInfo-${cardInfo.id}-${key}-${nbCopie}`;
        const cardInfoToDisplayJson: CardInfoToDisplayType = {
            cardInfo: cardInfo,
            popoverId: popoverId,
        };
        const img = (
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
        );
        return (
            <Grid
                key={`${fieldType}-cardInfo-${cardInfo.id}-${key}-${nbCopie}`}
                item
                xs={6}
                md={3}
                sx={{ [Theme.breakpoints.down("md")]: { margin: "auto", textAlign: "center" } }}
            >
                {displayRemoveIcon === true && props.handleRemoveCard !== undefined ? (
                    <Badge
                        color="error"
                        overlap="rectangular"
                        anchorOrigin={{
                            vertical: "top",
                            horizontal: "right",
                        }}
                        badgeContent={
                            <RemoveIcon
                                sx={{ cursor: "pointer" }}
                                onClick={() => {
                                    if (props.handleRemoveCard !== undefined) {
                                        props.handleRemoveCard(key, fieldType);
                                    }
                                }}
                            />
                        }
                    >
                        {img}
                    </Badge>
                ) : (
                    img
                )}
            </Grid>
        );
    };

    const displayCard = () => {
        return cardFieldTypeArray.map((cardFieldType) => {
            const openDeckCardFromFieldType = openDeckCard[cardFieldType];
            const deckCardFromFieldTypeArray = deckCard[cardFieldType];
            let nbCardInFieldType = 0;
            for (let i = 0; i < deckCardFromFieldTypeArray.length; i++) {
                const el = deckCardFromFieldTypeArray[i];
                let nbCopieToAdd = 1;
                if ("nbCopie" in el) {
                    nbCopieToAdd = el.nbCopie;
                }
                nbCardInFieldType += nbCopieToAdd;
            }
            return (
                <Grid key={`deckCard-${cardFieldType}`} item xs={12} container spacing={2} sx={{ marginTop: Theme.spacing(2) }}>
                    <Grid item xs={12}>
                        <Typography
                            component="span"
                            sx={{ fontWeight: "bolder", cursor: "pointer" }}
                            onClick={(e) =>
                                setOpenDeckCard((prevState) => {
                                    let newOpenDeckCard = { ...prevState };
                                    newOpenDeckCard[cardFieldType] = !newOpenDeckCard[cardFieldType];
                                    return newOpenDeckCard;
                                })
                            }
                        >
                            {`${Capitalize(cardFieldType)} (${nbCardInFieldType})`}
                            {openDeckCardFromFieldType === true ? (
                                <KeyboardArrowUpIcon sx={{ verticalAlign: "middle" }} />
                            ) : (
                                <KeyboardArrowDownIcon sx={{ verticalAlign: "middle" }} />
                            )}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} container spacing={1}>
                        <Collapse in={openDeckCardFromFieldType} timeout="auto" sx={{ width: "100%", marginTop: Theme.spacing(2) }}>
                            <Grid item xs={12} container spacing={1} direction="row" justifyItems="flex-start" alignContent="flex-start">
                                {deckCardFromFieldTypeArray.map((deckCardInfo, deckCardInfoKey) => {
                                    let cardInfo: CardSearchType;
                                    let nbCopie = 1;
                                    if ("nbCopie" in deckCardInfo === true) {
                                        cardInfo = deckCardInfo.cards[0];
                                        nbCopie = deckCardInfo.nbCopie;
                                    } else {
                                        cardInfo = deckCardInfo;
                                    }
                                    const arrayNumber = CreateArrayNumber(0, nbCopie - 1);
                                    return arrayNumber.map((i) => {
                                        return displayDeckCardPicture(cardInfo, cardFieldType, deckCardInfoKey, i);
                                    });
                                })}
                            </Grid>
                        </Collapse>
                    </Grid>
                </Grid>
            );
        });
    };

    return (
        <>
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
            {displayCard()}
        </>
    );
}
