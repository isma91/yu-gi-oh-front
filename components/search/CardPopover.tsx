import { Fragment } from "react";
import { makeStyles } from "@mui/styles";
import { Grid, Typography, Theme, useTheme, Popover, useMediaQuery } from "@mui/material";
import { GetCardDescription, GetCardInfoStringJson, GetCardPictureUrl } from "@utils/SearchCard";
import { CardInfoToDisplayType, SearchCardCardInfoJsonType } from "@app/types/SearchCard";
import Image from "next/image";

type PositionHorizontalPopoverType = "left" | "right" | "center";
type PositionVerticalPopoverType = "center" | "bottom" | "top";

type SearchPopoverPropsType = {
    open: boolean;
    handleClose: () => void;
    cardInfoToDisplay: CardInfoToDisplayType | null;
    anchorEl: HTMLImageElement | null;
    anchorOriginPositionVertical?: PositionVerticalPopoverType;
    anchorOriginPositionHorizontal?: PositionHorizontalPopoverType;
    transformOriginPositionVertical?: PositionVerticalPopoverType;
    transformOriginPositionHorizontal?: PositionHorizontalPopoverType;
};

const useStyles = makeStyles((theme: Theme) => ({
    cardPicturePopover: {
        objectFit: "contain",
        height: "auto",
        width: "100%",
        float: "right",
        verticalAlign: "middle",
    },
}));

export default function SearchCardPopover(props: SearchPopoverPropsType) {
    const { open, handleClose, cardInfoToDisplay, anchorEl } = props;
    const Theme = useTheme();
    const classes = useStyles();
    const mediaQueryUpMd = useMediaQuery(Theme.breakpoints.up("md"));
    const limitText = mediaQueryUpMd === true ? 400 : 300;
    let anchorOriginPositionVerticalPopover: PositionVerticalPopoverType = "top";
    let anchorOriginPositionHorizontalPopover: PositionHorizontalPopoverType = "right";
    let transformOriginPositionVerticalPopover: PositionVerticalPopoverType = "bottom";
    let transformOriginPositionHorizontalPopover: PositionHorizontalPopoverType = "center";
    if (props.anchorOriginPositionVertical !== undefined) {
        anchorOriginPositionVerticalPopover = props.anchorOriginPositionVertical;
    }
    if (props.anchorOriginPositionHorizontal !== undefined) {
        anchorOriginPositionHorizontalPopover = props.anchorOriginPositionHorizontal;
    }
    if (props.transformOriginPositionVertical !== undefined) {
        transformOriginPositionVerticalPopover = props.transformOriginPositionVertical;
    }
    if (props.transformOriginPositionHorizontal !== undefined) {
        transformOriginPositionHorizontalPopover = props.transformOriginPositionHorizontal;
    }

    const displayPopover = () => {
        if (cardInfoToDisplay === null || mediaQueryUpMd === false) {
            return null;
        }
        const { cardInfo, popoverId } = cardInfoToDisplay;
        const pictureUrl = GetCardPictureUrl(cardInfo);
        const cardInfoStringJson: SearchCardCardInfoJsonType = GetCardInfoStringJson(cardInfo);
        const cardInfoStringJsonKeyArray = Object.keys(cardInfoStringJson) as Array<keyof SearchCardCardInfoJsonType>;
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
                onClose={handleClose}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: anchorOriginPositionVerticalPopover,
                    horizontal: anchorOriginPositionHorizontalPopover,
                }}
                transformOrigin={{
                    vertical: transformOriginPositionVerticalPopover,
                    horizontal: transformOriginPositionHorizontalPopover,
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
                        <Typography component="p">{GetCardDescription(cardInfo, limitText)}</Typography>
                    </Grid>
                    <Grid item xs={3} sx={{ height: "100%", textAlign: "center" }}>
                        <Image
                            width={0}
                            height={0}
                            sizes="100vw"
                            alt={`Card ${cardInfo.name} picture in popover`}
                            src={pictureUrl}
                            className={classes.cardPicturePopover}
                        />
                    </Grid>
                </Grid>
            </Popover>
        );
    };

    return open === true && anchorEl !== null && cardInfoToDisplay !== null ? displayPopover() : null;
}
