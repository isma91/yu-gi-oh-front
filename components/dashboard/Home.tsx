import { useState } from "react";
import { Grid, Theme, useTheme, useMediaQuery, Container, Typography } from "@mui/material";
import DashboardMenu from "@components/dashboard/Menu";
import { DashboardMenuItemElementType } from "@app/types/DashboardMenu";
import HomeIcon from "@mui/icons-material/Home";
import MenuIcon from "@mui/icons-material/Menu";
import StyleIcon from "@mui/icons-material/Style";
import BookIcon from "@mui/icons-material/Book";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import SettingsIcon from "@mui/icons-material/Settings";
import GenericStyles from "@app/css/style";
import { makeStyles } from "@mui/styles";
import { CardRouteName, CARD_ROUTE_JSON, CARD_BASE_URL } from "@routes/Card";
import { DECK_BASE_URL, DECK_ROUTE_JSON, DeckRouteName } from "@routes/Deck";
import { COLLECTION_BASE_URL, COLLECTION_ROUTE_JSON, CollectionRouteName } from "@routes/Collection";
import { SETTING_BASE_URL } from "@routes/Setting";
import Divider from "@components/Divider";

type DashboardHomeType = {
    children: React.ReactNode;
    active?: number;
    activeChild?: number;
    title?: string;
};

const useStyles = makeStyles((theme: Theme) => ({
    gridMenu: {
        height: "100vh",
    },
    gridChildren: {
        "& > *": {
            paddingTop: theme.spacing(2),
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
        },
    },
}));

export default function DashboardHome(props: DashboardHomeType): React.JSX.Element {
    const { children } = props;
    const [openMenu, setOpenMenu] = useState<boolean>(false);
    const genericClasses = GenericStyles();
    const classes = useStyles();
    const Theme = useTheme();
    const mediaQueryUpMd = useMediaQuery(Theme.breakpoints.up("md"));

    let active: number = -1;
    let activeChild: number = -1;
    if (props.active !== undefined) {
        active = props.active;
    }
    if (props.activeChild !== undefined) {
        activeChild = props.activeChild;
    }

    const menuItem: DashboardMenuItemElementType[] = [
        {
            name: "Home",
            path: "/",
            logo: <HomeIcon />,
        },
        {
            name: "Card",
            path: CARD_BASE_URL,
            parentPath: `${CARD_BASE_URL}${CARD_ROUTE_JSON[CardRouteName.CARD_SEARCH]}`,
            logo: <StyleIcon />,
            children: [
                {
                    name: "Card Search",
                    path: CARD_ROUTE_JSON[CardRouteName.CARD_SEARCH],
                },
                {
                    name: "Set Search",
                    path: CARD_ROUTE_JSON[CardRouteName.SET_SEARCH],
                },
            ],
        },
        {
            name: "Deck",
            path: DECK_BASE_URL,
            parentPath: `${DECK_BASE_URL}${DECK_ROUTE_JSON[DeckRouteName.LIST]}`,
            logo: <BookIcon />,
            children: [
                {
                    name: "List",
                    path: DECK_ROUTE_JSON[DeckRouteName.LIST],
                },
                {
                    name: "Create",
                    path: DECK_ROUTE_JSON[DeckRouteName.CREATE],
                },
            ],
        },
        {
            name: "Collection",
            path: COLLECTION_BASE_URL,
            logo: <AutoStoriesIcon />,
            children: [
                {
                    name: "List",
                    path: COLLECTION_ROUTE_JSON[CollectionRouteName.LIST],
                },
                {
                    name: "Create",
                    path: COLLECTION_ROUTE_JSON[CollectionRouteName.LIST],
                },
            ],
        },
        {
            name: "Setting",
            path: SETTING_BASE_URL,
            logo: <SettingsIcon />,
        },
    ];

    const displayDashboardMenu = (): React.JSX.Element => {
        const dashboardMenuJsx = (
            <DashboardMenu
                name="dashboard-menu"
                openMenuState={[openMenu, setOpenMenu]}
                menuItem={menuItem}
                active={active}
                activeChild={activeChild}
            />
        );
        if (mediaQueryUpMd === false) {
            return (
                <>
                    <Grid item>
                        <MenuIcon
                            className={`${genericClasses.cursorPointer}`}
                            sx={{
                                float: "left",
                                fontSize: "xx-large",
                                [Theme.breakpoints.down("md")]: {
                                    fontSize: "xxx-large",
                                },
                            }}
                            onClick={(e) => setOpenMenu(true)}
                        />
                    </Grid>
                    {dashboardMenuJsx}
                </>
            );
        } else {
            return (
                <Grid item xs={2} className={genericClasses.positionSticky + " " + classes.gridMenu}>
                    {dashboardMenuJsx}
                </Grid>
            );
        }
    };

    return (
        <Grid container spacing={2}>
            {displayDashboardMenu()}
            <Grid item xs={mediaQueryUpMd ? 10 : 12} className={classes.gridChildren}>
                <Container>
                    {props.title !== undefined ? (
                        <>
                            <Grid item xs={12}>
                                <Typography component="span">{props.title}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Divider variant="middle" />
                            </Grid>
                        </>
                    ) : null}
                    <Grid item xs={12}>
                        {children}
                    </Grid>
                </Container>
            </Grid>
        </Grid>
    );
}
