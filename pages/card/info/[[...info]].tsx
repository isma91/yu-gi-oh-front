import React, { useState, useEffect, useContext, useRef } from "react";
import { StoreContext } from "@app/lib/state-provider";
import useRouterQuery from "@app/hooks/useRouterQuery";
import { useSnackbar } from "notistack";
import { useRouter } from "next/router";
import { CardRouteName, GetFullRoute } from "@routes/Card";
import { Capitalize, CheckUuid } from "@utils/String";
import DashboardHome from "@components/dashboard/Home";
import CardGetInfoRequest from "@api/Card/GetInfo";
import { makeStyles } from "@mui/styles";
import { Paper, Grid, useTheme, Skeleton, Theme, Typography } from "@mui/material";
import { CardGetInfoType } from "@app/types/entity/Card";
import { CardPictureGetAllType } from "@app/types/entity/CardPicture";
import { AddApiBaseUrl, GetDefaultCardPicturePath } from "@utils/Url";
import "@app/css/card.css";

type CardInfoPictureType = Pick<CardPictureGetAllType, "id" | "pictureUrl" | "pictureSmallUrl" | "artworkUrl">;

type CardInfoPictureKeyType = "pictureUrl" | "pictureSmallUrl" | "artworkUrl";

type CardInfoJsonType = {
    [key in string]: string | number | null;
};

type CardInfoOtherPictureArrayType = {
    pictureUrl: string;
    pictureSmallUrl: string;
    artworkUrl: string;
};

const useStyles = makeStyles((theme: Theme) => ({
    cardInfoCardPictureImg: {
        width: "100%",
        height: "auto",
        [theme.breakpoints.up("md")]: {
            "&:hover": {
                transform: "scale(1.2)",
                boxShadow: `0 0 15px ${theme.palette.grey[900]}`,
            },
        },
    },
    cardInfoOtherCardPictureImg: {
        cursor: "pointer",
    },
}));

export default function CardInfoPage() {
    const { state: globalState } = useContext(StoreContext);
    const router = useRouter();
    const classes = useStyles();
    const Theme = useTheme();
    const { enqueueSnackbar } = useSnackbar();
    const { query, loading: loadingRouterQuery } = useRouterQuery(router.query);
    const [cardInfo, setCardInfo] = useState<CardGetInfoType | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentPictureUrl, setCurrentPictureUrl] = useState<string>(GetDefaultCardPicturePath());
    const [skipCurrentPictureUrlUpdateInit, setSkipCurrentPictureUrlUpdateInit] = useState<boolean>(false);
    const cardInfoPictureRef = useRef<React.LegacyRef<HTMLImageElement> | any>(null);
    const queryKeyName = "info";

    const redirectToCardSearchPage = () => {
        router.push(GetFullRoute(CardRouteName.CARD_SEARCH));
    };

    const getCardInfoReq = async (cardUuid: string) => {
        return CardGetInfoRequest(cardUuid)
            .then((res) => {
                setCardInfo(res.data.card);
            })
            .catch((err) => {
                enqueueSnackbar(err, { variant: "error" });
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        if (globalState.user !== null && loadingRouterQuery === false) {
            const queryKeyArray = Object.keys(query);
            if (queryKeyArray.length === 0 || queryKeyArray.includes(queryKeyName) === false) {
                redirectToCardSearchPage();
            } else {
                const queryInfoArray = query[queryKeyName] as string[];
                if (queryInfoArray.length === 0) {
                    redirectToCardSearchPage();
                }
                let cardUuidString = null;
                for (let i = 0; i < queryInfoArray.length; i++) {
                    const el = queryInfoArray[i];
                    if (CheckUuid(el) === true) {
                        cardUuidString = el;
                        break;
                    }
                }
                if (cardUuidString === null) {
                    setLoading(false);
                } else {
                    getCardInfoReq(cardUuidString);
                }
            }
        }
    }, [loadingRouterQuery, globalState]);

    const displayCardPictureUrlFromFieldName = (picture: CardInfoPictureType, fieldName: CardInfoPictureKeyType): string => {
        let url = null;
        let pictureUrl = picture[fieldName];
        if (pictureUrl !== null) {
            url = AddApiBaseUrl(pictureUrl);
        }
        if (url === null) {
            url = GetDefaultCardPicturePath();
        }
        return url;
    };

    const displayCardInfoGrid = (key: string, value: number | string): React.JSX.Element => {
        return (
            <Grid key={`cardInfo-${key}`} item xs={12} md={4} container spacing={2} sx={{ marginTop: Theme.spacing(1) }}>
                <Paper
                    elevation={1}
                    sx={{
                        width: "90%",
                        borderRadius: "10px",
                        backgroundColor: Theme.palette.grey[200],
                        padding: Theme.spacing(1),
                    }}
                >
                    <Grid item xs={12}>
                        <Typography
                            component="p"
                            sx={{
                                fontSize: "0.8rem",
                                fontWeight: "bolder",
                                [Theme.breakpoints.down("md")]: {
                                    textAlign: "center",
                                },
                            }}
                        >
                            {Capitalize(key)}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography component="p" sx={{ textAlign: "center", fontSize: "1.2rem" }}>
                            {value}
                        </Typography>
                    </Grid>
                </Paper>
            </Grid>
        );
    };

    const displayCardInfoDescription = (cardInfoDescriptionJson: { [key in string]: string | null }) => {
        const cardInfoDescriptionJsonKeyArray = Object.keys(cardInfoDescriptionJson);
        return cardInfoDescriptionJsonKeyArray.map((cardInfoDescriptionKey) => {
            const cardText = cardInfoDescriptionJson[cardInfoDescriptionKey];
            if (cardText === null) {
                return null;
            }
            return (
                <Grid key={`cardInfo-${cardInfoDescriptionKey}`} item xs={12} sx={{ marginTop: Theme.spacing(1) }}>
                    <Typography
                        component="p"
                        sx={{
                            fontSize: "1.5rem",
                            fontWeight: "bolder",
                            [Theme.breakpoints.down("md")]: {
                                textAlign: "center",
                            },
                        }}
                    >
                        {Capitalize(cardInfoDescriptionKey)}
                    </Typography>
                    <Typography
                        component="p"
                        sx={{
                            [Theme.breakpoints.down("md")]: {
                                textAlign: "center",
                            },
                        }}
                    >
                        {cardText}
                    </Typography>
                </Grid>
            );
        });
    };

    const handleOtherPicture = (otherPictureArray: CardInfoOtherPictureArrayType, fieldName: keyof CardInfoOtherPictureArrayType) => {
        const newUrl = otherPictureArray[fieldName];
        if (newUrl !== currentPictureUrl) {
            if (cardInfoPictureRef.current !== null) {
                cardInfoPictureRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
            }
            setCurrentPictureUrl(newUrl);
            setSkipCurrentPictureUrlUpdateInit(true);
        }
    };

    const displayCardInfo = (cardInfo: CardGetInfoType): React.JSX.Element => {
        const {
            category,
            subCategory,
            archetype,
            attribute,
            type,
            property,
            isEffect,
            attackPoints,
            defensePoints,
            subProperties,
            subTypes,
            description,
            pendulumDescription,
            monsterDescription,
            pictures,
        } = cardInfo;
        let subCategoryLinkSlugName = "link";
        let isLink = false;
        let cardInfoCategory = "Unknown";
        if (category !== null) {
            cardInfoCategory = category.name;
        }
        let cardInfoSubCategory: string | null = null;
        if (subCategory !== null) {
            cardInfoSubCategory = subCategory.name;
            if (subCategory.slugName === subCategoryLinkSlugName) {
                isLink = true;
            }
        }
        let cardInfoArchetype: string | null = null;
        if (archetype !== null) {
            cardInfoArchetype = archetype.name;
        }
        let cardInfoAttribute: string | null = null;
        if (attribute !== null) {
            cardInfoAttribute = attribute.name;
        }
        let cardInfoType: string | null = null;
        if (type !== null) {
            cardInfoType = type.name;
        }
        let cardInfoPropertyType: string | null = null;
        let cardInfoProperty: string | null = null;
        if (property !== null) {
            cardInfoProperty = property.name;
            if (property.propertyType !== null) {
                cardInfoPropertyType = property.propertyType.name;
            }
        }
        let cardInfoAtk: number | null = null;
        if (attackPoints !== null) {
            cardInfoAtk = attackPoints;
        }
        let cardInfoDef: number | null = null;
        if (isLink === false && defensePoints !== null) {
            cardInfoDef = defensePoints;
        }
        let cardInfoSubPropertyType: string | null = null;
        let cardInfoSubProperty: string = "";
        if (subProperties.length !== 0) {
            subProperties.forEach((subProperty) => {
                if (cardInfoSubPropertyType === null && subProperty.subPropertyType !== null) {
                    cardInfoSubPropertyType = subProperty.subPropertyType.name;
                }
                cardInfoSubProperty += `${subProperty.name}, `;
            });
        }
        if (cardInfoSubProperty !== "") {
            cardInfoSubProperty = cardInfoSubProperty.slice(0, -2);
        }
        let cardInfoSubType: string | null = "";
        if (subTypes.length !== 0) {
            subTypes.forEach((subType) => {
                cardInfoSubType += `${subType.name}, `;
            });
        }
        if (cardInfoSubType !== "") {
            cardInfoSubType = cardInfoSubType.slice(0, -2);
        } else {
            cardInfoSubType = null;
        }
        let cardInfoJson: CardInfoJsonType = {
            category: cardInfoCategory,
            subCategory: cardInfoSubCategory,
            archetype: cardInfoArchetype,
            attribute: cardInfoAttribute,
            race: cardInfoType,
            ATK: cardInfoAtk,
            DEF: cardInfoDef,
            ability: cardInfoSubType,
        };
        if (cardInfoProperty !== null && cardInfoPropertyType !== null) {
            cardInfoJson[cardInfoPropertyType] = cardInfoProperty;
        }
        if (cardInfoSubPropertyType !== null && cardInfoSubProperty !== "") {
            cardInfoJson[cardInfoSubPropertyType] = cardInfoSubProperty;
        }
        if (cardInfoJson.subCategory === null && isEffect !== null) {
            let cardInfoJsonCategory = cardInfoJson.category;
            const isEffectString = isEffect === true ? "Effect" : "Normal";
            cardInfoJsonCategory = `${isEffectString} ${cardInfoJsonCategory}`;
            cardInfoJson.category = cardInfoJsonCategory;
        }
        const cardInfoJsonKeyArray = Object.keys(cardInfoJson);
        const cardInfoDescriptionJson = {
            "pendulum Text": pendulumDescription,
            "card Text": monsterDescription === null ? description : monsterDescription,
        };
        let cardInfoOtherPictureArray: CardInfoOtherPictureArrayType[] = [];
        let pictureUrl: string = "";
        if (pictures.length !== 0) {
            pictureUrl = displayCardPictureUrlFromFieldName(pictures[0], "pictureUrl");
            pictures.forEach((pictureArray) => {
                const pictureArrayJsonUrl = {
                    pictureUrl: displayCardPictureUrlFromFieldName(pictureArray, "pictureUrl"),
                    pictureSmallUrl: displayCardPictureUrlFromFieldName(pictureArray, "pictureSmallUrl"),
                    artworkUrl: displayCardPictureUrlFromFieldName(pictureArray, "artworkUrl"),
                };
                cardInfoOtherPictureArray.push(pictureArrayJsonUrl);
            });
        } else {
            pictureUrl = GetDefaultCardPicturePath();
        }
        if (pictureUrl !== currentPictureUrl && skipCurrentPictureUrlUpdateInit === false) {
            setCurrentPictureUrl(pictureUrl);
        }
        return (
            <Grid item xs={12} container spacing={2} sx={{ height: "100%" }}>
                <Grid item xs={12} md={4}>
                    <img ref={cardInfoPictureRef} src={currentPictureUrl} className={`${classes.cardInfoCardPictureImg} cardInfoCardPictureImg`} />
                </Grid>
                <Grid item xs={12} md={8} container spacing={2} sx={{ height: "100%" }}>
                    <Grid item xs={12}>
                        <Typography
                            component="h1"
                            sx={{
                                fontWeight: "bolder",
                                fontSize: "2.5rem",
                                textAlign: "center",
                            }}
                        >
                            {cardInfo.name}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} container spacing={2} sx={{ marginLeft: Theme.spacing(2) }}>
                        {cardInfoJsonKeyArray.map((cardInfoJsonKey) => {
                            const cardInfoJsonValue = cardInfoJson[cardInfoJsonKey];
                            if (cardInfoJsonValue === null) {
                                return null;
                            }
                            return displayCardInfoGrid(cardInfoJsonKey, cardInfoJsonValue);
                        })}
                    </Grid>
                    {displayCardInfoDescription(cardInfoDescriptionJson)}
                </Grid>
                {cardInfoOtherPictureArray.length > 1 ? (
                    <Grid item xs={12} container spacing={2} justifyContent="center" alignItems="center">
                        <Grid item xs={12}>
                            <Typography
                                component="p"
                                sx={{
                                    fontWeight: "bolder",
                                    fontSize: "1.5rem",
                                    textAlign: "center",
                                }}
                            >{`${cardInfo.name} Variant Artwork`}</Typography>
                        </Grid>
                        {cardInfoOtherPictureArray.map((otherPictureArray, otherPictureArrayKey) => {
                            return (
                                <Grid key={`cardInfoSmallPictureUrl-${otherPictureArrayKey}`} item xs={4} md={2}>
                                    <img
                                        src={otherPictureArray.pictureSmallUrl}
                                        className={`${classes.cardInfoCardPictureImg} ${classes.cardInfoOtherCardPictureImg} cardInfoCardPictureImg`}
                                        onClick={(e) => handleOtherPicture(otherPictureArray, "pictureUrl")}
                                    />
                                </Grid>
                            );
                        })}
                    </Grid>
                ) : null}
            </Grid>
        );
    };

    return (
        <DashboardHome active={1} title="Card Info Page">
            <Grid container spacing={2} sx={{ marginTop: (theme) => theme.spacing(1), height: "100%" }}>
                {loading === true ? (
                    <Grid item xs={12}>
                        <Skeleton animation="wave" variant="rounded" width="100%" height="50vh" />
                    </Grid>
                ) : cardInfo !== null ? (
                    displayCardInfo(cardInfo)
                ) : (
                    <Grid item xs={12} sx={{ height: "100%" }}>
                        <Typography component="p">Card not found, maybe the url is broken ?</Typography>
                    </Grid>
                )}
            </Grid>
        </DashboardHome>
    );
}
