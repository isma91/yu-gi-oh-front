import { useContext } from "react";
import { Theme, Grid, Typography, useTheme, Paper, useMediaQuery } from "@mui/material";
import { StoreContext } from "@app/lib/state-provider";
import { useRouter } from "next/router";
import { DeckGetAllFromCurrentUserType } from "@app/types/entity/Deck";
import SearchPaginationDisplay from "@components/search/PaginationDisplay";
import { makeStyles } from "@mui/styles";
import { AddApiBaseUrl, GetDefaultCardPicturePath } from "@utils/Url";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import { DeckRouteName, GetFullRoute } from "@routes/Deck";
import { IsAdmin } from "@utils/Role";

type SearchDeckDisplayProps = {
    deckResult: DeckGetAllFromCurrentUserType[];
    offsetState: [number, React.Dispatch<React.SetStateAction<number>>];
    limit: number;
    deckAllResultCount: number;
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

export default function SearchDeckDisplay(props: SearchDeckDisplayProps) {
    const { deckResult, limit, deckAllResultCount } = props;
    const router = useRouter();
    const classes = useStyles();
    const Theme = useTheme();
    const { state: globalState } = useContext(StoreContext);

    const checkIfDisplayable = (deckInfo: DeckGetAllFromCurrentUserType): boolean => {
        const deckUserUserName = deckInfo.user.username;
        const { isPublic } = deckInfo;
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
            return user.username === deckUserUserName;
        }
    };

    return (
        <Grid container spacing={2}>
            <SearchPaginationDisplay offsetState={props.offsetState} allResultCount={deckAllResultCount} limit={limit} entity="deck" />
            <Grid item xs={12} container spacing={2} sx={{ marginTop: Theme.spacing(2) }}>
                {deckResult.map((deckInfo) => {
                    if (checkIfDisplayable(deckInfo) === false) {
                        return null;
                    }
                    const { id, name, slugName, isPublic, artworkUrl } = deckInfo;
                    let artwork = artworkUrl;
                    if (artwork !== null) {
                        artwork = AddApiBaseUrl(artwork);
                    } else {
                        artwork = GetDefaultCardPicturePath();
                    }
                    return (
                        <Grid
                            key={`deck-list-${id}-${slugName}`}
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
                            onClick={(e) => router.push(GetFullRoute(DeckRouteName.INFO, { id: id.toString(10), slugName: slugName }))}
                        >
                            <Paper
                                elevation={1}
                                sx={{
                                    width: "100%",
                                }}
                            >
                                <Grid item xs={12}>
                                    <img src={artwork} className={classes.deckPicture} />
                                </Grid>
                                <Grid item xs={12} sx={{ textAlign: "center" }}>
                                    <Typography component="span">
                                        <span className={classes.deckTitle}>{name}</span>
                                        <span>{` by ${deckInfo.user.username}`}</span>
                                        {isPublic ? (
                                            <LockOpenOutlinedIcon className={classes.deckIcon} />
                                        ) : (
                                            <LockOutlinedIcon className={classes.deckIcon} />
                                        )}
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
