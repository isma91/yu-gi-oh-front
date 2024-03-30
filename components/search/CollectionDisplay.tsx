import { useContext } from "react";
import { Theme, Grid, Typography, useTheme, Paper } from "@mui/material";
import { StoreContext } from "@app/lib/state-provider";
import { useRouter } from "next/router";
import SearchPaginationDisplay from "@components/search/PaginationDisplay";
import { makeStyles } from "@mui/styles";
import { AddApiBaseUrl, GetDefaultCardPicturePath } from "@utils/Url";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import { CollectionRouteName, GetFullRoute } from "@routes/Collection";
import { IsAdmin } from "@utils/Role";
import Image from "next/image";
import { CollectionGetFromFilterFromCurrentUserType } from "@app/types/entity/Collection";
import { Pluralize } from "@utils/String";

type SearchCollectionDisplayProps = {
    collectionResult: CollectionGetFromFilterFromCurrentUserType[];
    offsetState: [number, React.Dispatch<React.SetStateAction<number>>];
    limit: number;
    collectionAllResultCount: number;
};

const useStyles = makeStyles((theme: Theme) => ({
    deckPicture: {
        width: "100%",
        objectFit: "cover",
        height: "350px",
        [theme.breakpoints.down("md")]: {
            height: "200px",
            objectFit: "cover",
        },
    },
    deckTitle: {
        fontSize: "1.2rem",
        fontWeight: "bolder",
        textAlign: "center",
    },
    deckIcon: {
        verticalAlign: "text-bottom",
    },
}));

export default function SearchCollectionDisplay(props: SearchCollectionDisplayProps) {
    const { collectionResult, limit, collectionAllResultCount } = props;
    const router = useRouter();
    const classes = useStyles();
    const Theme = useTheme();
    const { state: globalState } = useContext(StoreContext);

    const checkIfDisplayable = (collectionInfo: CollectionGetFromFilterFromCurrentUserType): boolean => {
        const collectionUserUserName = collectionInfo.user.username;
        const { isPublic } = collectionInfo;
        const { user } = globalState;
        if (IsAdmin(globalState) === true) {
            return true;
        }
        if (user === null) {
            return false;
        }
        if (isPublic === true) {
            return true;
        } else {
            return user.username === collectionUserUserName;
        }
    };

    return (
        <Grid container spacing={2}>
            <SearchPaginationDisplay offsetState={props.offsetState} allResultCount={collectionAllResultCount} limit={limit} entity="collection" />
            <Grid item xs={12} container spacing={2} sx={{ marginTop: Theme.spacing(2) }}>
                {collectionResult.map((collectionInfo) => {
                    if (checkIfDisplayable(collectionInfo) === false) {
                        return null;
                    }
                    const { id, name, slugName, isPublic, artworkUrl, cardCardCollectionNumber } = collectionInfo;
                    let artwork = artworkUrl;
                    if (artwork !== null) {
                        artwork = AddApiBaseUrl(artwork);
                    } else {
                        artwork = GetDefaultCardPicturePath();
                    }
                    return (
                        <Grid
                            key={`collection-list-${id}-${slugName}`}
                            item
                            xs={12}
                            md={3}
                            container
                            spacing={1}
                            sx={{
                                cursor: "pointer",
                                marginLeft: Theme.spacing(2),
                                marginTop: Theme.spacing(1),
                                padding: `${Theme.spacing(0)} !important`,
                            }}
                            onClick={(e) => router.push(GetFullRoute(CollectionRouteName.INFO, { id: id.toString(10), slugName: slugName }))}
                        >
                            <Paper
                                elevation={1}
                                sx={{
                                    width: "100%",
                                }}
                            >
                                <Grid item xs={12}>
                                    <Image
                                        width={0}
                                        height={0}
                                        sizes="100vw"
                                        alt={`Deck ${collectionInfo.name} artwork`}
                                        src={artwork}
                                        className={classes.deckPicture}
                                    />
                                </Grid>
                                <Grid item xs={12} sx={{ textAlign: "center" }}>
                                    <Typography component="span">
                                        <span className={classes.deckTitle}>{name}</span>
                                        <span>{` by ${collectionInfo.user.username}`}</span>
                                        {isPublic ? (
                                            <LockOpenOutlinedIcon className={classes.deckIcon} />
                                        ) : (
                                            <LockOutlinedIcon className={classes.deckIcon} />
                                        )}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sx={{ textAlign: "center" }}>
                                    <Typography component="span">
                                        <span style={{ fontWeight: "bolder" }}>{`${cardCardCollectionNumber} ${Pluralize(
                                            "card",
                                            cardCardCollectionNumber
                                        )}`}</span>
                                        {` in this collection`}
                                    </Typography>
                                </Grid>
                            </Paper>
                        </Grid>
                    );
                })}
            </Grid>
        </Grid>
    );
}
