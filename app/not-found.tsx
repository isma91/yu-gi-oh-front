"use client";
import "@app/css/not-found.css";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Grid, Skeleton, Typography } from "@mui/material";
import CardGetRandomRequest from "@api/Card/GetRandom";
import { useSnackbar } from "notistack";
import { CardRandomType } from "@app/types/entity/Card";
import { AddApiBaseUrl, GetDefaultCardPicturePath } from "@utils/Url";
import { CardRouteName, GetFullRoute } from "@routes/Card";

export default function NotFound() {
    const { enqueueSnackbar } = useSnackbar();
    const [card, setCard] = useState<CardRandomType | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [skip, setSkip] = useState<boolean>(false);
    const pictureId = "picture";
    const gridPictureSx = { margin: "auto", textAlign: "center" };
    const nextImageProps = { id: pictureId, width: 0, height: 0, sizes: "100vw" };

    useEffect(() => {
        const sendCardGetRandomReq = async () => {
            return CardGetRandomRequest()
                .then((res) => {
                    setCard(res.data.card);
                })
                .catch((err) => enqueueSnackbar(err, { variant: "error" }))
                .finally(() => {
                    setLoading(false);
                    setSkip(true);
                });
        };
        if (skip === false) {
            sendCardGetRandomReq();
        }
    }, [skip, card, enqueueSnackbar]);

    const displayCardInfo = (cardInfo: CardRandomType) => {
        const { uuid, name, slugName, pictures } = cardInfo;
        let pictureUrl = GetDefaultCardPicturePath();
        if (pictures.length !== 0) {
            if (pictures[0].pictureUrl !== null) {
                pictureUrl = AddApiBaseUrl(pictures[0].pictureUrl);
            }
        }
        const cardUrl = GetFullRoute(CardRouteName.INFO, { uuid: uuid, slugName: slugName });
        return (
            <Grid item xs={12} sx={{ ...gridPictureSx }}>
                <Link style={{ textDecoration: "none" }} href={cardUrl}>
                    <Image {...nextImageProps} src={pictureUrl} alt={`Card ${name} picture`} />
                    <br />
                    <Typography component="span" sx={{ fontSize: "1.5rem", color: "#FFFFFF", marginTop: (theme) => theme.spacing(2) }}>
                        {cardInfo.name}
                    </Typography>
                </Link>
            </Grid>
        );
    };

    const displayNotFound = () => {
        return (
            <Grid
                item
                xs={12}
                container
                spacing={2}
                justifyContent="center"
                sx={{ "& p": { fontSize: "1.2rem", color: "#FFFFFF" }, marginTop: (theme) => theme.spacing(5) }}
            >
                {card !== null ? (
                    displayCardInfo(card)
                ) : (
                    <Grid item xs={12} sx={{ ...gridPictureSx }}>
                        <Link href="/">
                            <Image {...nextImageProps} src={GetDefaultCardPicturePath()} alt="default card picture" />
                        </Link>
                    </Grid>
                )}
                <Grid item xs={12}>
                    <Typography component="p" sx={{ textAlign: "center" }}>
                        Looks like you are in the Shadow Realm !!
                    </Typography>
                    <Typography component="p" sx={{ textAlign: "center" }}>
                        Grab this random Card above or stay here foreveeeeer !!!
                    </Typography>
                    <Typography component="p" sx={{ textAlign: "center", fontSize: "0.8rem !important" }}>
                        <Link href="/">You can also go to the Home page...</Link>
                    </Typography>
                </Grid>
            </Grid>
        );
    };

    return (
        <Grid
            container
            spacing={2}
            justifyContent="center"
            sx={{ minHeight: "101vh", minWidth: "101vw", backgroundColor: (theme) => theme.palette.grey[500] }}
        >
            {loading === true ? (
                <Grid item xs={12} sx={{ margintTop: (theme) => theme.spacing(5) }}>
                    <Skeleton
                        animation="wave"
                        variant="rounded"
                        width="50vw"
                        height="50vh"
                        sx={{ position: "absolute", top: "25vh", left: "25vw" }}
                    />
                </Grid>
            ) : (
                displayNotFound()
            )}
        </Grid>
    );
}
