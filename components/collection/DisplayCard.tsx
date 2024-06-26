import { useState } from "react";
import { makeStyles } from "@mui/styles";
import { useTheme, Grid, Typography, Theme } from "@mui/material";
import { CardSearchType } from "@app/types/entity/Card";
import { GetCardPictureUrl } from "@utils/SearchCard";
import { CardInfoToDisplayType } from "@app/types/SearchCard";
import SearchCardPopover from "@components/search/CardPopover";
import { CardRouteName, GetFullRoute } from "@routes/Card";
import { RedirectToNewTab } from "@utils/Route";
import { useRouter } from "next/router";
import Image from "next/image";
import { CollectionGetInfoType } from "@app/types/entity/Collection";
import { TransformCollectionInfoToCardCollectionInfo } from "@utils/Collection";

type DisplayCollectionCardPropsType = {
    cardCollection: CollectionGetInfoType;
};

const useStyles = makeStyles((theme: Theme) => ({
    cardPicturePictureView: {
        objectFit: "contain",
        height: "200px",
        width: "auto",
        "&:hover": {
            cursor: "pointer",
        },
    },
}));

export default function DisplayCollectionCard(props: DisplayCollectionCardPropsType) {
    const { cardCollection } = props;
    const classes = useStyles();
    const router = useRouter();
    const [cardInfoToDisplay, setCardInfoToDisplay] = useState<CardInfoToDisplayType | null>(null);
    const [anchorEl, setAnchorEl] = useState<HTMLImageElement | null>(null);
    const openPopover = Boolean(anchorEl);
    const Theme = useTheme();

    const handlePopoverClose = () => {
        setAnchorEl(null);
        setCardInfoToDisplay(null);
    };

    const handleClick = (cardInfo: CardSearchType) => {
        const { uuid, slugName } = cardInfo;
        const option = {
            uuid: uuid,
            slugName: slugName,
        };
        const url = GetFullRoute(CardRouteName.INFO, option);
        RedirectToNewTab(router, url);
    };

    const displayCard = () => {
        const newCardCollection = TransformCollectionInfoToCardCollectionInfo(cardCollection);
        return (
            <Grid item xs={12} container spacing={2} sx={{ marginTop: Theme.spacing(2) }}>
                {newCardCollection.map((cardCollectionInfo, cardCollectionInfoKey) => {
                    const { card, set, rarity, country } = cardCollectionInfo;
                    const { name, slugName } = card;
                    const pictureUrl = GetCardPictureUrl(card);
                    const popoverId = `popover-collection-cardInfo-${card.id}-${cardCollectionInfoKey}`;
                    const cardInfoToDisplayJson: CardInfoToDisplayType = {
                        cardInfo: card,
                        popoverId: popoverId,
                    };
                    return (
                        <Grid
                            key={`collection-${slugName}-${cardCollectionInfoKey}`}
                            item
                            xs={12}
                            md={3}
                            sx={{ cursor: "pointer", "& p": { textAlign: "center" } }}
                            onClick={(e) => handleClick(card)}
                        >
                            <Grid item xs={12} sx={{ margin: "auto", textAlign: "center" }}>
                                <Image
                                    width={0}
                                    height={0}
                                    sizes="100vw"
                                    aria-owns={popoverId}
                                    aria-haspopup="true"
                                    src={pictureUrl}
                                    className={classes.cardPicturePictureView}
                                    onMouseEnter={(e) => {
                                        setAnchorEl(e.currentTarget);
                                        setCardInfoToDisplay(cardInfoToDisplayJson);
                                    }}
                                    onMouseLeave={handlePopoverClose}
                                    alt={`Card ${name} picture`}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography component="p" sx={{ fontWeight: "bolder" }}>
                                    {name}
                                </Typography>
                                <Typography component="p">
                                    <span style={{ fontWeight: "bolder" }}>Set: </span>
                                    <span style={{ fontSize: "0.9rem" }}>{` ${set.name}`}</span>
                                </Typography>
                                <Typography component="p">
                                    <span style={{ fontWeight: "bolder" }}>Rarity: </span>
                                    <span style={{ fontSize: "0.9rem" }}>{` ${rarity.name}`}</span>
                                </Typography>
                                <Typography component="p">
                                    <span style={{ fontWeight: "bolder" }}>Country: </span>
                                    <span style={{ fontSize: "0.9rem" }}>{` ${country.name}`}</span>
                                </Typography>
                            </Grid>
                        </Grid>
                    );
                })}
            </Grid>
        );
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
