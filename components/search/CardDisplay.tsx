import React, { useState } from "react";
import { CardSearchType } from "@app/types/entity/Card";
import GenericStyles from "@app/css/style";
import { makeStyles } from "@mui/styles";
import { useTheme, Theme, useMediaQuery, Grid, IconButton, Typography, Paper } from "@mui/material";
import ViewListOutlinedIcon from "@mui/icons-material/ViewListOutlined";
import ImageIcon from "@mui/icons-material/Image";
import { SearchCardDisplayType } from "@app/types/Search";
import { AddApiBaseUrl, GetDefaultCardPicturePath } from "@utils/Url";
import "@app/css/card.css";
import { useRouter } from "next/router";
import { CardRouteName, GetFullRoute } from "@routes/Card";
import SearchCardPopover from "@components/search/CardPopover";
import { GetCardCategoryWithSubCategory, GetCardDescription, GetCardInfoStringJson, GetCardPictureUrl } from "@utils/SearchCard";
import { CardInfoToDisplayType } from "@app/types/SearchCard";
import { enqueueSnackbar } from "notistack";
import SearchPaginationDisplay from "@components/search/PaginationDisplay";
import { RedirectToNewTab } from "@utils/Route";

type SearchCardDisplayProps = {
    cardResult: CardSearchType[];
    offsetState: [number, React.Dispatch<React.SetStateAction<number>>];
    limit: number;
    cardAllResultCount: number;
    isFromCreatePage?: true;
    openDialogState?: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
    setCardDialogInfo?: React.Dispatch<React.SetStateAction<CardSearchType | null>>;
    autoClick?: boolean;
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
    const open = Boolean(anchorEl);
    const router = useRouter();
    const Theme = useTheme();
    const genericClasses = GenericStyles();
    const classes = useStyles();
    const mediaQueryUpMd = useMediaQuery(Theme.breakpoints.up("md"));
    const limitText = mediaQueryUpMd === true ? 400 : 300;
    const isFromCreatePage = props.isFromCreatePage !== undefined;
    let openDialog: boolean | null = null;
    let setOpenDialog: React.Dispatch<React.SetStateAction<boolean>> | null = null;
    if (props.openDialogState !== undefined) {
        [openDialog, setOpenDialog] = props.openDialogState;
    }
    let setCardDialogInfo: React.Dispatch<React.SetStateAction<CardSearchType | null>> | null = null;
    if (props.setCardDialogInfo !== undefined) {
        setCardDialogInfo = props.setCardDialogInfo;
    }
    let autoClick: boolean = false;
    if (props.autoClick !== undefined) {
        autoClick = props.autoClick;
    }

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

    const displayListView = (cardInfo: CardSearchType): React.JSX.Element => {
        const pictureUrl = GetCardPictureUrl(cardInfo);
        const cardInfoStringJson = GetCardInfoStringJson(cardInfo);
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
                            {GetCardDescription(cardInfo, limitText)}
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
        );
    };

    const displayPictureView = (cardInfo: CardSearchType) => {
        const pictureUrl = getPictureUrl(cardInfo);
        const popoverId = `popover-cardInfo-${cardInfo.id}`;
        const cardInfoToDisplayJson: CardInfoToDisplayType = {
            cardInfo: cardInfo,
            popoverId: popoverId,
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

    const handleCardClick = (cardInfo: CardSearchType) => {
        const { uuid, slugName } = cardInfo;
        if (isFromCreatePage === true && openDialog !== null && setOpenDialog !== null && setCardDialogInfo !== null) {
            const cardInfoCategorySubCategory = GetCardCategoryWithSubCategory(cardInfo);
            if (cardInfoCategorySubCategory.toLowerCase().includes("token") === true) {
                enqueueSnackbar("You can't add token in your deck.", { variant: "warning" });
                setCardDialogInfo(null);
            } else {
                setCardDialogInfo(cardInfo);
                if (autoClick === false) {
                    setOpenDialog(true);
                }
            }
        } else {
            const option = {
                uuid: uuid,
                slugName: slugName,
            };
            const url = GetFullRoute(CardRouteName.CARD_INFO, option);
            RedirectToNewTab(router, url);
        }
    };

    return (
        <Grid container spacing={2}>
            {displayIconView()}
            <SearchPaginationDisplay offsetState={props.offsetState} allResultCount={cardAllResultCount} limit={limit} entity="card" />
            <Grid item xs={12}>
                <Paper elevation={1} sx={{ width: "100%", backgroundColor: Theme.palette.grey[200] }}>
                    <Grid item xs={12} container>
                        {cardResult.map((card, k) => {
                            return displayType === SearchCardDisplayType.LIST ? displayListView(card) : displayPictureView(card);
                        })}
                    </Grid>
                </Paper>
            </Grid>
            <SearchCardPopover open={open} handleClose={handlePopoverClose} anchorEl={anchorEl} cardInfoToDisplay={cardInfoToDisplay} />
        </Grid>
    );
}
