import React, { Fragment, useState, useEffect, useContext } from "react";
import { StoreContext } from "@app/lib/state-provider";
import { DashboardMenuItemElementChildrenType, DashboardMenuItemElementParentType, DashboardMenuItemElementType } from "@app/types/DashboardMenu";
import { Drawer, List, Theme, useTheme, useMediaQuery, ListItem, Typography, Collapse, IconButton, ListItemButton } from "@mui/material";
import Divider from "@components/Divider";
import { makeStyles } from "@mui/styles";
import GenericStyles from "@app/css/style";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import LogoutIcon from "@mui/icons-material/Logout";
import { useRouter } from "next/router";
import { CancelPropagation } from "@utils/Event";
import { Capitalize } from "@utils/String";
import { useSnackbar } from "notistack";
import LogoutRequest from "@api/User/Auth/Logout";
import AdminName from "@app/.admin-name";
import { ActionNameType } from "@app/types/GlobalState";

type DashboardMenuPropsType = {
    name: string;
    menuItem: DashboardMenuItemElementType[];
    openMenuState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
    active: number;
    activeChild: number;
};

type OpenChildType = { index: number; open: boolean };

const useStyles = makeStyles((theme: Theme) => ({
    elementMenu: {
        cursor: "pointer",
        "&:hover": {
            backgroundColor: theme.palette.third.main,
        },
    },
    marginLeft: {
        marginLeft: "5% !important",
    },
    elementMenuAdmin: {
        backgroundColor: "red",
    },
}));

export default function Menu(props: DashboardMenuPropsType): React.JSX.Element {
    const { name, menuItem, active, activeChild } = props;
    const { state: globalState, dispatch } = useContext(StoreContext);
    const { enqueueSnackbar } = useSnackbar();
    const [isAdmin, setIsAdmin] = useState(false);
    const [open, setOpen] = props.openMenuState;
    const [openChild, setOpenChild] = useState<OpenChildType[]>([]);
    const router = useRouter();
    const genericClasses = GenericStyles();
    const classes = useStyles();
    const Theme = useTheme();
    const mediaQueryUpMd = useMediaQuery(Theme.breakpoints.up("md"));
    const selectedItemClassName = genericClasses.cursorPointer + " " + genericClasses.backgroundColorThirdMain;

    const menuItemAdmin = [{ name: "Admin", path: "/admin", logo: <SupervisorAccountIcon /> }];

    useEffect(() => {
        let newIsAdmin = false;
        if (globalState.user !== null && globalState.user.role !== undefined) {
            if (globalState.user.role === AdminName) {
                newIsAdmin = true;
            }
        }
        setIsAdmin(newIsAdmin);
    }, [globalState]);

    useEffect(() => {
        if (menuItem !== undefined) {
            let newOpenChild: OpenChildType[] = [];
            for (let i = 0; i < menuItem.length; i++) {
                const item = menuItem[i];
                if (item.children !== undefined) {
                    newOpenChild.push({ index: i, open: active === i });
                }
            }
            setOpenChild(newOpenChild);
        }
    }, [menuItem, active, activeChild]);

    const findOpenChildIsOpen = (index: number): boolean => {
        let response = false;
        for (let i = 0; i < openChild.length; i++) {
            const el = openChild[i];
            if (el.index === index) {
                response = el.open;
                break;
            }
        }
        return response;
    };

    const findOpenChildIndexArray = (index: number): number => {
        let response = -1;
        for (let i = 0; i < openChild.length; i++) {
            const el = openChild[i];
            if (el.index === index) {
                response = i;
                break;
            }
        }
        return response;
    };

    const displayDrawerMenuItemChildren = (
        childrenArray: DashboardMenuItemElementChildrenType[],
        url: string,
        index: number
    ): React.JSX.Element[] => {
        return childrenArray.map((child, key) => {
            const childClassName = active === index && activeChild === key ? selectedItemClassName : classes.elementMenu;
            return (
                <Collapse key={`${name}-${index}-${key}`} in={findOpenChildIsOpen(index)}>
                    <ListItem onClick={(e) => router.push(url + child.path)} className={childClassName} sx={{ paddingLeft: "10%" }}>
                        {displayDrawerMenuItem(child)}
                    </ListItem>
                </Collapse>
            );
        });
    };

    const updateOpenChild = (index: number) => {
        const indexArray = findOpenChildIndexArray(index);
        if (indexArray !== -1) {
            setOpenChild((prevState) => {
                let newOpenChild = [...prevState];
                newOpenChild[indexArray].open = !newOpenChild[indexArray].open;
                return newOpenChild;
            });
        }
    };

    const launchUpdateOpenChild = (event: React.MouseEvent, index: number) => {
        CancelPropagation(event);
        updateOpenChild(index);
    };

    const displayDrawerMenuItem = (element: DashboardMenuItemElementChildrenType | DashboardMenuItemElementParentType): React.JSX.Element => {
        let logo: React.JSX.Element;
        if ("logo" in element) {
            logo = element.logo;
        } else {
            logo = <KeyboardArrowRightIcon />;
        }
        return (
            <>
                <Typography component="span" className={genericClasses.verticalAlign}>
                    {logo}
                </Typography>
                <Typography component="span" className={classes.marginLeft}>
                    {Capitalize(element.name)}
                </Typography>
            </>
        );
    };

    const displayCloseMenu = () => {
        return (
            <ListItemButton sx={{ paddingBottom: "5%", justifyContent: "center", maxHeight: "15vh" }} onClick={handleClose}>
                <Typography
                    component="span"
                    sx={{
                        textAlign: "center",
                        fontSize: "1.5em",
                    }}
                >
                    Close the menu
                </Typography>
                <Typography
                    component="span"
                    sx={{ position: "absolute", top: Theme.spacing(1), right: Theme.spacing(1), color: Theme.palette.primary.main }}
                >
                    <CloseIcon />
                </Typography>
            </ListItemButton>
        );
    };

    const handleLogout = async () => {
        return LogoutRequest()
            .then((res) => {})
            .catch((err) => {
                enqueueSnackbar(err, { variant: "error" });
            })
            .finally(() => {
                dispatch({ type: ActionNameType.Logout, payload: null });
            });
    };

    const handleClose = () => {
        setOpen(false);
    };

    const displayMenuItemFromArray = (menuItemArray: DashboardMenuItemElementType[], isAdmin: boolean = false): React.JSX.Element[] => {
        return menuItemArray.map((v, k) => {
            const key = `${name}-${k}`;
            let className = active === k && activeChild === -1 ? selectedItemClassName : classes.elementMenu;
            if (isAdmin === true) {
                className = `${classes.elementMenu} ${classes.elementMenuAdmin}`;
            }
            const childIsOpen = findOpenChildIsOpen(k);
            const url = v.parentPath !== undefined ? v.parentPath : v.path;
            const hasChildren = v.children !== undefined;
            return (
                <Fragment key={key}>
                    <ListItem onClick={(e) => router.push(url)} className={className}>
                        {displayDrawerMenuItem(v)}
                        {hasChildren === true ? (
                            childIsOpen === true ? (
                                <IconButton className={genericClasses.verticalAlign}>
                                    <ExpandLessIcon onClick={(e) => launchUpdateOpenChild(e, k)} />
                                </IconButton>
                            ) : (
                                <ExpandMoreIcon className={genericClasses.verticalAlign} onClick={(e) => launchUpdateOpenChild(e, k)} />
                            )
                        ) : null}
                    </ListItem>
                    {v.children !== undefined ? displayDrawerMenuItemChildren(v.children, url, k) : null}
                </Fragment>
            );
        });
    };

    const displayDivider = (): React.JSX.Element => {
        return <Divider variant="middle" thickness={3} />;
    };

    return (
        <Drawer
            variant={mediaQueryUpMd ? "permanent" : "temporary"}
            sx={{
                root: {
                    position: "relative",
                },
                "& .MuiDrawer-paper": {
                    height: "100vh",
                    position: "relative",
                    backgroundColor: "cornsilk",
                },
            }}
            anchor="left"
            onClose={handleClose}
            open={mediaQueryUpMd ? true : open}
        >
            {mediaQueryUpMd === false ? (
                <>
                    {displayCloseMenu()}
                    {displayDivider()}
                </>
            ) : null}
            <List sx={{ with: "100%" }}>
                {displayMenuItemFromArray(menuItem)}
                {isAdmin === true ? (
                    <>
                        {displayDivider()}
                        {displayMenuItemFromArray(menuItemAdmin, true)}
                    </>
                ) : null}
                {displayDivider()}
                <ListItem key="menu-logout" className={classes.elementMenu} onClick={handleLogout}>
                    <Typography component="span" className={genericClasses.verticalAlign}>
                        <LogoutIcon />
                    </Typography>
                    <Typography component="span" className={classes.marginLeft}>
                        {Capitalize("Logout")}
                    </Typography>
                </ListItem>
            </List>
        </Drawer>
    );
}
