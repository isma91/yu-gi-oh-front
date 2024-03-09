import React, { useState } from "react";
import { CardSearchType } from "@app/types/entity/Card";
import GenericStyles from "@app/css/style";
import { makeStyles } from "@mui/styles";
import { useTheme, Theme, useMediaQuery, Grid, IconButton, Typography, Paper } from "@mui/material";
import ViewListOutlinedIcon from "@mui/icons-material/ViewListOutlined";
import ImageIcon from "@mui/icons-material/Image";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { SearchCardDisplayType } from "@app/types/Search";
import Button from "@components/field/Button";
import { IconPositionEnumType } from "@app/types/Input";
import { AddApiBaseUrl } from "@utils/Url";
import { LimitText } from "@utils/String";
import "@app/css/card-search.css";

type SearchCardDisplayProps = {
    cardResult: CardSearchType[];
    offsetState: [number, React.Dispatch<React.SetStateAction<number>>];
    limit: number;
    cardAllResultCount: number;
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
        width: "100%",
        objectFit: "contain",
        height: "200px",
    },
}));

export default function SearchCardDisplay(props: SearchCardDisplayProps) {
    const { cardResult, limit, cardAllResultCount } = props;
    const [displayType, setDisplayType] = useState<SearchCardDisplayType>(SearchCardDisplayType.LIST);
    const [offset, setOffset] = props.offsetState;
    const Theme = useTheme();
    const genericClasses = GenericStyles();
    const classes = useStyles();
    const mediaQueryUpMd = useMediaQuery(Theme.breakpoints.up("md"));
    const categoryMonsterSlugName = "monster";
    const limitText = mediaQueryUpMd === true ? 400 : 300;

    const displayIconView = (): React.JSX.Element => {
        const imageIcon = (
            <IconButton onClick={(e) => setDisplayType(SearchCardDisplayType.PICTURE)}>
                <ImageIcon />
            </IconButton>
        );
        const viewListIcon = (
            <IconButton onClick={(e) => setDisplayType(SearchCardDisplayType.LIST)}>
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
            stringCardAtkDef += ` Atk: ${cardInfoAtk}`;
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

    const displayListView = (cardInfo: CardSearchType, k: number): React.JSX.Element => {
        let pictureUrl = null;
        if (cardInfo.picture.pictureSmallUrl !== null) {
            pictureUrl = AddApiBaseUrl(cardInfo.picture.pictureSmallUrl);
        } else {
            pictureUrl = "/static/images/card/default.png";
        }
        const cardTypeString = displayCardType(cardInfo);
        const cardAtkDefString = displayCardAtkDef(cardInfo);
        let cardInfoCategorySubCategoryTypeAtkDef = displayCardCategoryWithSubCategory(cardInfo);
        if (cardTypeString !== "") {
            cardInfoCategorySubCategoryTypeAtkDef += ` | ${cardTypeString}`;
        }
        if (cardAtkDefString !== "") {
            cardInfoCategorySubCategoryTypeAtkDef += ` | ${cardAtkDefString}`;
        }
        return (
            <Grid
                key={`card-${cardInfo.slugName}-${k}`}
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

    const displayPictureView = (cardInfo: CardSearchType, k: number) => {
        let pictureUrl = null;
        if (cardInfo.picture.pictureSmallUrl !== null) {
            pictureUrl = AddApiBaseUrl(cardInfo.picture.pictureSmallUrl);
        } else {
            pictureUrl = "/static/images/card/default.png";
        }
        return (
            <Grid item xs={6} md={3} sx={{ margin: "auto" }}>
                <img src={pictureUrl} className={classes.cardPicturePictureView} />
            </Grid>
        );
    };

    return (
        <Grid container spacing={2}>
            {displayIconView()}
            {displaySearchButtonWithInfo()}
            <Grid item xs={12}>
                <Paper elevation={1} sx={{ width: "100%", backgroundColor: Theme.palette.grey[200] }}>
                    <Grid item xs={12} container>
                        {cardResult.map((card, k) => {
                            return displayType === SearchCardDisplayType.LIST ? displayListView(card, k) : displayPictureView(card, k);
                        })}
                    </Grid>
                </Paper>
            </Grid>
        </Grid>
    );
}
