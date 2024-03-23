import { SetSearchType } from "@app/types/entity/Set";
import { Grid, Paper, Typography, useTheme } from "@mui/material";
import { useRouter } from "next/router";
import SearchPaginationDisplay from "./PaginationDisplay";
import { RedirectToNewTab } from "@utils/Route";
import { GetFullRoute, SetRouteName } from "@routes/Set";
import { GetFormat } from "@utils/Date";
import { DateFormatTypeType } from "@app/types/Date";

type SearchSetDisplayPropsType = {
    setResult: SetSearchType[];
    offsetState: [number, React.Dispatch<React.SetStateAction<number>>];
    limit: number;
    setAllResultCount: number;
};

export default function SearchSetDisplay(props: SearchSetDisplayPropsType) {
    const { setResult, limit, setAllResultCount } = props;
    const router = useRouter();
    const Theme = useTheme();

    return (
        <Grid item xs={12} container spacing={2}>
            <SearchPaginationDisplay offsetState={props.offsetState} allResultCount={setAllResultCount} limit={limit} entity="set" />
            <Grid item xs={12} container spacing={2} sx={{ margin: "auto" }}>
                <Paper elevation={1} sx={{ width: "100%", backgroundColor: Theme.palette.grey[200] }}>
                    <Grid container spacing={2}>
                        {setResult.map((set, setKey) => {
                            const { id, name, slugName, code, nbCard } = set;
                            const style = { fontWeight: "bolder" };
                            let releaseDate = "Unknown";
                            if (set.releaseDate !== null) {
                                releaseDate = GetFormat(set.releaseDate, DateFormatTypeType.DATE);
                            }
                            return (
                                <Grid
                                    key={`setSearch-${id}-${setKey}`}
                                    item
                                    xs={12}
                                    md={4}
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
                                        },
                                        cursor: "pointer",
                                    }}
                                    onClick={(e) => {
                                        const option = { id: id.toString(10), slugName: slugName };
                                        const url = GetFullRoute(SetRouteName.INFO, option);
                                        RedirectToNewTab(router, url);
                                    }}
                                >
                                    <Grid item xs={12}>
                                        <Typography component="p" sx={{ fontWeight: "bolder", fontSize: "1.2rem" }}>
                                            {name}
                                        </Typography>
                                        {code !== "" ? (
                                            <Typography component="p">
                                                <span>Code:</span>
                                                <span style={{ ...style }}>{` ${code}`}</span>
                                            </Typography>
                                        ) : null}
                                        <Typography component="p">
                                            <span>Number of Card:</span>
                                            <span style={{ ...style }}>{` ${nbCard}`}</span>
                                        </Typography>
                                        <Typography component="p">
                                            <span>Release Date:</span>
                                            <span style={{ ...style }}>{` ${releaseDate}`}</span>
                                        </Typography>
                                    </Grid>
                                </Grid>
                            );
                        })}
                    </Grid>
                </Paper>
            </Grid>
        </Grid>
    );
}
