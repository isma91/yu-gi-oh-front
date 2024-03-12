import React, { useState, Fragment } from "react";
import { CardSearchType } from "@app/types/entity/Card";
import GenericStyles from "@app/css/style";
import { makeStyles } from "@mui/styles";
import { useTheme, Theme, useMediaQuery, Grid, IconButton, Typography, Paper, Popover } from "@mui/material";
import ViewListOutlinedIcon from "@mui/icons-material/ViewListOutlined";
import ImageIcon from "@mui/icons-material/Image";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { SearchCardDisplayType } from "@app/types/Search";
import Button from "@components/field/Button";
import { IconPositionEnumType } from "@app/types/Input";
import { AddApiBaseUrl, GetDefaultCardPicturePath } from "@utils/Url";
import { LimitText } from "@utils/String";
import "@app/css/card-search.css";
import { useRouter } from "next/router";
import { CardRouteName, GetFullRoute } from "@routes/Card";

type SearchCardDisplayProps = {
    cardResult: CardSearchType[];
    offsetState: [number, React.Dispatch<React.SetStateAction<number>>];
    limit: number;
    cardAllResultCount: number;
};

type SearchCardCardInfoJsonKeyType =
    | "categoryWithSubCategory"
    | "attribute"
    | "type"
    | "atkDef"
    | "propertyWithPropertyType"
    | "subPropertyWithPropertyType";

type SearchCardCardInfoJsonType = {
    [key in SearchCardCardInfoJsonKeyType]: string;
};

type AnchorPositionHorizontalType = "left" | "right";

type CardInfoToDisplayType = {
    cardInfo: CardSearchType;
    popoverId: string;
    countPicturePictureView: number;
};

const useStyles = makeStyles((theme: Theme) => ({
    gridListViewCardInfo: {
        width: "100%",
        height: "250px",
        marginLeft: "0 !important",
        [theme.breakpoints.down("md")]: {
            height: "auto",
            paddingLeft: `${theme.spacing(2)} !important`,
            paddingRight: `${theme.spacing(2)} !important`,
        },
        "&:hover": {
            backgroundColor: theme.palette.grey[800],
            color: "#FFFFFF",
            boxShadow: `0 0 15px ${theme.palette.grey[900]}`,
            transform: "scale(1.1)",
            cursor: "pointer",
        },
    },
    cardPictureGridListView: {
        width: "100%",
        height: "100%",
        paddingTop: "0 !important",
        [theme.breakpoints.down("md")]: {
            height: "50%",
            textAlign: "center",
            paddingLeft: "0 !important",
        },
    },
    cardPictureListView: {
        width: "100%",
        height: "100%",
        objectFit: "contain",
        [theme.breakpoints.down("md")]: {
            width: "50%",
            textAlign: "center",
        },
    },
    cardPicturePictureView: {
        objectFit: "contain",
        height: "200px",
        "&:hover": {
            cursor: "pointer",
        },
    },
    cardPicturePopover: {
        objectFit: "contain",
        height: "auto",
        width: "100%",
        float: "right",
        verticalAlign: "middle",
    },
}));

export default function SearchCardDisplay(props: SearchCardDisplayProps) {
    const { cardResult, limit, cardAllResultCount } = props;
    const [displayType, setDisplayType] = useState<SearchCardDisplayType>(SearchCardDisplayType.LIST);
    const [anchorEl, setAnchorEl] = useState<HTMLImageElement | null>(null);
    const [cardInfoToDisplay, setCardInfoToDisplay] = useState<CardInfoToDisplayType | null>(null);
    const [offset, setOffset] = props.offsetState;
    const open = Boolean(anchorEl);
    const router = useRouter();
    const Theme = useTheme();
    const genericClasses = GenericStyles();
    const classes = useStyles();
    const mediaQueryUpMd = useMediaQuery(Theme.breakpoints.up("md"));
    const categoryMonsterSlugName = "monster";
    const limitText = mediaQueryUpMd === true ? 400 : 300;
    const countCardPicturePictureViewPerRow = 4;
    const countCardPicturePictureViewPerRowIsEvent = countCardPicturePictureViewPerRow % 2 === 0;
    let countPicturePictureView = 0;

    const handleDisplayButton = (searchCardDisplayType: SearchCardDisplayType) => {
        handlePopoverClose();
        setDisplayType(searchCardDisplayType);
    };

    const displayIconView = (): React.JSX.Element => {
        const imageIcon = (
            <IconButton onClick={(e) => handleDisplayButton(SearchCardDisplayType.PICTURE)}>
                <ImageIcon />
            </IconButton>
        );
        const viewListIcon = (
            <IconButton onClick={(e) => handleDisplayButton(SearchCardDisplayType.LIST)}>
                <ViewListOutlinedIcon />
            </IconButton>
        );
        return (
            <Grid item xs={12} container direction="row" justifyContent="center" alignItems="flex-start">
                {mediaQueryUpMd ? (
                    <Grid item xs={1}>
                        {imageIcon}
                        {viewListIcon}
                    </Grid>
                ) : (
                    <>
                        <Grid item xs={1}>
                            {imageIcon}
                        </Grid>
                        <Grid item xs={1}>
                            {viewListIcon}
                        </Grid>
                    </>
                )}
            </Grid>
        );
    };

    const displaySearchButtonWithInfo = (): React.JSX.Element => {
        const currentPage = offset + 1;
        const numTotalPage = Math.ceil(cardAllResultCount / limit);
        const disablePreviousPageButton = currentPage <= 1;
        const disableNextPageButton = currentPage >= numTotalPage;
        return (
            <Grid item xs={12} container direction="row" justifyContent="center" alignItems="center">
                <Grid item xs={4}>
                    <Button
                        loading={false}
                        icon={<ArrowBackIcon />}
                        iconPosition={IconPositionEnumType.START}
                        disabled={disablePreviousPageButton}
                        onClick={(e) => {
                            if (offset >= 1) {
                                setOffset(offset - 1);
                            }
                        }}
                    >
                        previous page
                    </Button>
                </Grid>
                <Grid item xs={4}>
                    <Typography
                        component="p"
                        className={genericClasses.textAlignCenter}
                    >{`Page ${currentPage}/${numTotalPage} of ${cardAllResultCount} total card`}</Typography>
                </Grid>
                <Grid item xs={4}>
                    <Button
                        loading={false}
                        icon={<ArrowForwardIcon />}
                        iconPosition={IconPositionEnumType.END}
                        disabled={disableNextPageButton}
                        onClick={(e) => {
                            if (offset <= numTotalPage) {
                                setOffset(offset + 1);
                            }
                        }}
                    >
                        next page
                    </Button>
                </Grid>
            </Grid>
        );
    };

    const displayCardCategoryWithSubCategory = (cardInfo: CardSearchType): string => {
        const { category: cardInfoCategory, isEffect, subCategory: cardInfoSubCategory, subTypes: cardInfoSubTypeArray } = cardInfo;
        if (cardInfoCategory === null) {
            return "";
        }
        const isMonster = cardInfoCategory.slugName === categoryMonsterSlugName;
        let cardCategoryWithSubCategory = cardInfoCategory.name;
        if (cardInfoSubCategory !== null) {
            cardCategoryWithSubCategory += `: ${cardInfoSubCategory.name}`;
        }
        if (isMonster === true) {
            if (cardInfoSubCategory === null) {
                if (isEffect !== null) {
                    const stringIsEffect = isEffect === true ? "Effect" : "Normal";
                    cardCategoryWithSubCategory += `: ${stringIsEffect}`;
                }
            }
            if (cardInfo.isPendulum === true) {
                cardCategoryWithSubCategory += ` / Pendulum`;
            }
        }
        if (cardInfoSubTypeArray.length !== 0) {
            cardInfoSubTypeArray.forEach((cardInfoSubType) => {
                cardCategoryWithSubCategory += ` / ${cardInfoSubType.name}`;
            });
        }
        return cardCategoryWithSubCategory;
    };

    const displayCardType = (cardInfo: CardSearchType): string => {
        const { type: cardInfoType } = cardInfo;
        if (cardInfoType === null) {
            return "";
        }
        return `Type: ${cardInfoType.name}`;
    };

    const displayCardAtkDef = (cardInfo: CardSearchType): string => {
        const { attackPoints: cardInfoAtk, defensePoints: cardInfoDef } = cardInfo;
        if (cardInfoAtk === null && cardInfoDef === null) {
            return "";
        }
        let stringCardAtkDef = "";
        if (cardInfoAtk !== null) {
            stringCardAtkDef = `Atk: ${cardInfoAtk}`;
        }
        if (cardInfoDef !== null) {
            stringCardAtkDef += ` Def: ${cardInfoDef}`;
        }
        return stringCardAtkDef;
    };

    const displayCardDescription = (cardInfo: CardSearchType): string => {
        const { description: cardInfoDescription, isPendulum, monsterDescription: cardInfoMonsterDescription } = cardInfo;
        let cardDescription = isPendulum === true ? cardInfoMonsterDescription : cardInfoDescription;
        return LimitText(cardDescription, limitText);
    };

    const displayCardAttribute = (cardInfo: CardSearchType): string => {
        const { attribute: cardInfoAttribute } = cardInfo;
        return cardInfoAttribute !== null ? `Attribute: ${cardInfoAttribute.name}` : "";
    };

    const displayPropertyWithPropertyType = (cardInfo: CardSearchType): string => {
        const { property: cardInfoProperty } = cardInfo;
        let cardInfoPropertyWithPopertyType = "";
        if (cardInfoProperty !== null) {
            const { propertyType: cardInfoPopertyType } = cardInfoProperty;
            if (cardInfoPopertyType !== null) {
                cardInfoPropertyWithPopertyType = `${cardInfoPopertyType.name}: ${cardInfoProperty.name}`;
            }
        }
        return cardInfoPropertyWithPopertyType;
    };

    const displaySubProperty = (cardInfo: CardSearchType): string => {
        const { subProperties: cardInfoSubPropertyArray } = cardInfo;
        if (cardInfoSubPropertyArray === null || cardInfoSubPropertyArray.length === 0) {
            return "";
        }
        let cardInfoSubProperty = "";
        let cardInfoSubPropertyType = "";
        cardInfoSubPropertyArray.forEach((subProperty) => {
            if (cardInfoSubPropertyType === "" && subProperty.subPropertyType !== null) {
                cardInfoSubPropertyType = `${cardInfoSubPropertyArray[0].subPropertyType.name}:`;
            }
            cardInfoSubProperty += ` ${subProperty.name}, `;
        });
        cardInfoSubProperty = cardInfoSubProperty.slice(0, -2);
        return `${cardInfoSubPropertyType}${cardInfoSubProperty}`;
    };

    const displayListView = (cardInfo: CardSearchType): React.JSX.Element => {
        const pictureUrl = getPictureUrl(cardInfo);
        const cardInfoStringJson = getCardInfoStringJson(cardInfo);
        const { categoryWithSubCategory, type, atkDef } = cardInfoStringJson;
        let cardInfoCategorySubCategoryTypeAtkDef = categoryWithSubCategory;
        if (type !== "") {
            cardInfoCategorySubCategoryTypeAtkDef += ` | ${type}`;
        }
        if (atkDef !== "") {
            cardInfoCategorySubCategoryTypeAtkDef += ` | ${atkDef}`;
        }
        return (
            <Grid
                key={`card-${cardInfo.id}`}
                item
                xs={12}
                container
                spacing={2}
                sx={{
                    marginTop: Theme.spacing(2),
                    marginBottom: Theme.spacing(3),
                    paddingLeft: Theme.spacing(1),
                    paddingRight: Theme.spacing(1),
                    [Theme.breakpoints.down("md")]: {
                        marginTop: Theme.spacing(1),
                        marginBottom: Theme.spacing(1),
                        paddingLeft: Theme.spacing(0),
                        paddingRight: Theme.spacing(0),
                    },
                }}
                className={`${classes.gridListViewCardInfo} gridListViewCardInfo`}
                onClick={(e) => handleCardClick(cardInfo)}
            >
                <Grid item xs={12} md={3} className={classes.cardPictureGridListView}>
                    <img src={pictureUrl} className={classes.cardPictureListView} />
                </Grid>
                <Grid
                    item
                    xs={12}
                    md={9}
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="flex-start"
                    sx={{ paddingLeft: "0 !important", paddingTop: "0 !important" }}
                >
                    <Grid item xs={12}>
                        <Typography component="p" sx={{ fontSize: "1.5rem" }} className={`${genericClasses.textAlignCenter} ${genericClasses.bold}`}>
                            {cardInfo.name}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography component="p" className={genericClasses.textAlignCenter}>
                            {cardInfoCategorySubCategoryTypeAtkDef}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography component="p" className={genericClasses.textAlignCenter}>
                            {displayCardDescription(cardInfo)}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
        );
    };

    const displayPictureView = (cardInfo: CardSearchType) => {
        const pictureUrl = getPictureUrl(cardInfo);
        countPicturePictureView++;
        const popoverId = `popover-cardInfo-${cardInfo.id}`;
        const cardInfoToDisplayJson: CardInfoToDisplayType = {
            cardInfo: cardInfo,
            popoverId: popoverId,
            countPicturePictureView: countPicturePictureView,
        };
        return (
            <Grid
                item
                xs={6}
                md={3}
                sx={{ margin: "auto", marginTop: Theme.spacing(2), marginBottom: Theme.spacing(2) }}
                className={genericClasses.textAlignCenter}
            >
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
                    onClick={(e) => handleCardClick(cardInfo)}
                />
            </Grid>
        );
    };

    const getPictureUrl = (cardInfo: CardSearchType): string => {
        let pictureUrl = null;
        if (cardInfo.picture.pictureSmallUrl !== null) {
            pictureUrl = AddApiBaseUrl(cardInfo.picture.pictureSmallUrl);
        } else {
            pictureUrl = GetDefaultCardPicturePath();
        }
        return pictureUrl;
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
        setCardInfoToDisplay(null);
    };

    const getCardInfoStringJson = (cardInfo: CardSearchType): SearchCardCardInfoJsonType => {
        return {
            categoryWithSubCategory: displayCardCategoryWithSubCategory(cardInfo),
            attribute: displayCardAttribute(cardInfo),
            type: displayCardType(cardInfo),
            atkDef: displayCardAtkDef(cardInfo),
            propertyWithPropertyType: displayPropertyWithPropertyType(cardInfo),
            subPropertyWithPropertyType: displaySubProperty(cardInfo),
        };
    };

    const displayPopover = () => {
        if (cardInfoToDisplay === null || mediaQueryUpMd === false) {
            return null;
        }
        const { cardInfo, popoverId, countPicturePictureView } = cardInfoToDisplay;
        const pictureUrl = getPictureUrl(cardInfo);
        const cardInfoStringJson: SearchCardCardInfoJsonType = getCardInfoStringJson(cardInfo);
        const cardInfoStringJsonKeyArray = Object.keys(cardInfoStringJson) as Array<keyof SearchCardCardInfoJsonType>;
        const countPicturePictureViewRow = Math.ceil(countPicturePictureView / countCardPicturePictureViewPerRow);
        const countPicturePictureViewRowMinusOne = countPicturePictureViewRow > 0 ? countPicturePictureViewRow - 1 : 0;
        const countPicturePictureViewRowPosition = countPicturePictureView - countPicturePictureViewRowMinusOne * countCardPicturePictureViewPerRow;
        const countCardPicturePictureViewPerRowMiddle = Math.ceil(countCardPicturePictureViewPerRow / 2);
        let anchorPositionHorizontal: AnchorPositionHorizontalType = "left";
        if (
            (countCardPicturePictureViewPerRowIsEvent === true && countPicturePictureViewRowPosition <= countCardPicturePictureViewPerRowMiddle) ||
            (countCardPicturePictureViewPerRowIsEvent === false && countPicturePictureViewRowPosition < countCardPicturePictureViewPerRowMiddle)
        ) {
            anchorPositionHorizontal = "right";
        }
        let cardInfoStringArray: string[] = [];
        cardInfoStringJsonKeyArray.map((cardInfoStringKey) => {
            const cardInfoStringJsonValue = cardInfoStringJson[cardInfoStringKey];
            if (cardInfoStringJsonValue !== "") {
                cardInfoStringArray.push(cardInfoStringJsonValue);
            }
        });
        return (
            <Popover
                open={open}
                id={popoverId}
                sx={{
                    pointerEvents: "none",
                    width: "100%",
                    height: "100%",
                }}
                slotProps={{
                    paper: {
                        sx: {
                            backgroundColor: "rgba(238,238,238, 0.9)",
                            maxWidth: "40%",
                            height: "auto",
                        },
                    },
                }}
                onClose={handlePopoverClose}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: anchorPositionHorizontal,
                }}
                transformOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                }}
                disableRestoreFocus
                disableScrollLock
            >
                <Grid container spacing={0} sx={{ height: "100%" }}>
                    <Grid item xs={9} spacing={0} sx={{ "& p": { marginLeft: Theme.spacing(1) } }}>
                        <Typography component="p" sx={{ fontSize: "1.5rem", marginTop: Theme.spacing(1) }}>
                            {cardInfo.name}
                        </Typography>
                        <br />
                        <Typography component="p">
                            {cardInfoStringArray.map((str, k) => {
                                return (
                                    <Fragment key={`cardInfo-${cardInfo.id}-popover-text-${k}`}>
                                        {str}
                                        <br />
                                    </Fragment>
                                );
                            })}
                        </Typography>
                        <br />
                        <Typography component="p">{displayCardDescription(cardInfo)}</Typography>
                    </Grid>
                    <Grid item xs={3} sx={{ height: "100%", textAlign: "center" }}>
                        <img src={pictureUrl} className={classes.cardPicturePopover} />
                    </Grid>
                </Grid>
            </Popover>
        );
    };

    const handleCardClick = (cardInfo: CardSearchType) => {
        const { uuid, slugName } = cardInfo;
        const option = {
            uuid: uuid,
            slugName: slugName,
        };
        const url = GetFullRoute(CardRouteName.CARD_INFO, option);
        router.push(url);
    };

    return (
        <Grid container spacing={2}>
            {displayIconView()}
            {displaySearchButtonWithInfo()}
            <Grid item xs={12}>
                <Paper elevation={1} sx={{ width: "100%", backgroundColor: Theme.palette.grey[200] }}>
                    <Grid item xs={12} container>
                        {cardResult.map((card, k) => {
                            return displayType === SearchCardDisplayType.LIST ? displayListView(card) : displayPictureView(card);
                        })}
                    </Grid>
                </Paper>
            </Grid>
            {open === true && anchorEl !== null && cardInfoToDisplay !== null ? displayPopover() : null}
        </Grid>
    );
}
