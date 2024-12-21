import React, { useState, useEffect, useContext, useMemo, useCallback } from "react";
import { StoreContext } from "@app/lib/state-provider";
import useRouterQuery from "@app/hooks/useRouterQuery";
import { useSnackbar } from "notistack";
import { useRouter } from "next/router";
import { Grid, Skeleton, Typography } from "@mui/material";
import { GetFormat } from "@utils/Date";
import { Capitalize, Pluralize } from "@utils/String";
import { AdminRouteName, GetFullRoute } from "@routes/Admin";
import UserGetUserAdminInfoRequest from "@api/User/GetUserAdminInfo";
import { UserGetAdminInfoType, UserGetAllUserInfoUserTokenType } from "@app/types/entity/User";
import { UserTrackingEntityType, UserTrackingInfoGeoIpType, UserTrackingInfoType } from "@app/types/entity/UserTracking";
import AdminName from "@app/.admin-name";
import DashboardHome from "@components/dashboard/Home";
import Collapse from "@components/display/Collapse";
import SensitiveData from "@components/display/SensitiveData";
import Dialog from "@components/display/Dialog";
import Button from "@components/field/Button";
import MapIcon from "@mui/icons-material/Map";
import DeleteIcon from "@mui/icons-material/Delete";
import dynamic from "next/dynamic";
import UserRevokeTokenRequest from "@api/User/Auth/RevokeToken";

type AdminUserInfoUserTokenBasicInfoType = { name: string; value: string | number };

type AdminUserInfoUserTrackingGeoipLocationType = {
    lattitude: number;
    longitude: number;
    accuracy_radius: number;
    address: string | null;
};

export default function AdminUserInfoPage() {
    const LeafletMap = dynamic(() => import("@components/display/Leaflet"), { ssr: false });
    const { state: globalState } = useContext(StoreContext);
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const customRouterQuery = useRouterQuery(router.query);
    const queryKeyName = "id-username";
    const adminBasePage = useMemo(() => GetFullRoute(AdminRouteName.BASE), []);
    const [user, setUser] = useState<UserGetAdminInfoType | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [skip, setSkip] = useState<boolean>(false);
    const [openMap, setOpenMap] = useState<boolean>(false);
    const [geoipLocation, setGeoipLocation] = useState<AdminUserInfoUserTrackingGeoipLocationType | null>(null);
    const spanStyle = { fontWeight: "bolder" };
    const sortBasicInfoArray = useCallback((array: AdminUserInfoUserTokenBasicInfoType[]) => {
        return array.sort((a, b) => a.name.localeCompare(b.name));
    }, []);
    const transformToBasicInfoArray = useCallback(
        (obj: object, key: string | number = "", result: AdminUserInfoUserTokenBasicInfoType[] = []): AdminUserInfoUserTokenBasicInfoType[] => {
            const objKeyArray = Object.keys(obj);
            objKeyArray.forEach((objKey) => {
                const objValue: any = obj[objKey as keyof object];
                let nameToAdd = objKey;
                if (key !== "") {
                    nameToAdd = `${key}-${objKey}`;
                }
                if (Array.isArray(objValue) === true) {
                    (objValue as Array<any>).forEach((el, key) => {
                        transformToBasicInfoArray(el, `${nameToAdd}-${key}`, result);
                    });
                } else if (typeof objValue === "object") {
                    if (objValue !== null) {
                        transformToBasicInfoArray(objValue, nameToAdd, result);
                    } else {
                        result.push({ name: Capitalize(nameToAdd), value: "NULL" });
                    }
                } else if (typeof objValue === "boolean") {
                    result.push({ name: Capitalize(nameToAdd), value: objValue === true ? "yes" : "no" });
                } else {
                    result.push({ name: Capitalize(nameToAdd), value: objValue });
                }
            });
            return sortBasicInfoArray(result);
        },
        [sortBasicInfoArray]
    );
    const userGetUserAdminInfoReq = useCallback(
        async (id: number) => {
            return UserGetUserAdminInfoRequest(id)
                .then((res) => {
                    setUser(res.data.user);
                })
                .catch((err) => enqueueSnackbar(err, { variant: "error" }))
                .finally(() => {
                    setLoading(false);
                    setSkip(true);
                });
        },
        [enqueueSnackbar]
    );

    const userRevokeTokenReq = async (id: number) => {
        setLoading(true);
        return UserRevokeTokenRequest(id)
            .then((res) => {
                enqueueSnackbar(res.success, { variant: "success" });
                if (user !== null) {
                    userGetUserAdminInfoReq(user.id);
                }
            })
            .catch((err) => enqueueSnackbar(err, { variant: "error" }))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        if (globalState.user !== null && customRouterQuery.loading === false && skip === false) {
            const { query } = customRouterQuery;
            const queryKeyArray = Object.keys(query);
            if (queryKeyArray.length === 0 || queryKeyArray.includes(queryKeyName) === false) {
                router.push(adminBasePage);
            } else {
                const idUsernameString = query[queryKeyName] as string;
                const idUsernameSplit = idUsernameString.split("-");
                if (idUsernameSplit.length === 0) {
                    router.push(adminBasePage);
                }
                const idUser = parseInt(idUsernameSplit[0], 10);
                userGetUserAdminInfoReq(idUser);
            }
        }
    }, [customRouterQuery, globalState, router, adminBasePage, skip, userGetUserAdminInfoReq]);

    const handleMap = (geoipLocation: AdminUserInfoUserTrackingGeoipLocationType) => {
        setGeoipLocation(geoipLocation);
        setOpenMap(true);
    };

    const displayBasicInfoArray = (array: AdminUserInfoUserTokenBasicInfoType[], key: string) => {
        return array.map((v, k) => {
            const { name, value } = v;
            return (
                <Grid key={`${name}-${key}-${k}`} item xs={12}>
                    <Typography component="p">
                        <span style={spanStyle}>{`${Capitalize(name)}: `}</span>
                        <SensitiveData name={key} confirm={false}>
                            <span>{value}</span>
                        </SensitiveData>
                    </Typography>
                </Grid>
            );
        });
    };

    const displayGeoIpInfoArray = (array: Array<{ name: string; value: UserTrackingInfoGeoIpType }>, key: string) => {
        return array.map((v, k) => {
            const { name, value: userTrackingInfoGeoIpObject } = v;
            const userTrackingInfoGeoIpObjectKeyArray = Object.keys(userTrackingInfoGeoIpObject);
            return (
                <Grid key={`${name}-${key}-${k}`} item xs={12}>
                    <Collapse
                        initialValue={false}
                        triggerElement={
                            <Typography component="span" sx={{ fontWeight: "bolder" }}>
                                {name}
                            </Typography>
                        }
                    >
                        <Grid key={`${name}-${key}-${k}-children`} item xs={12} container spacing={2} sx={{ marginTop: (theme) => theme.spacing(1) }}>
                            {userTrackingInfoGeoIpObjectKeyArray.map((v2, k2) => {
                                const userTrackingInfoGeoIpObjectValue = userTrackingInfoGeoIpObject[v2 as keyof UserTrackingInfoGeoIpType];
                                const isEmpty = Array.isArray(userTrackingInfoGeoIpObjectValue);
                                let geoIpBasicInfoArray: AdminUserInfoUserTokenBasicInfoType[] = [];
                                let geoipLocation: null | AdminUserInfoUserTrackingGeoipLocationType = null;
                                if (isEmpty === false) {
                                    if ("autonomous_system_number" in userTrackingInfoGeoIpObjectValue) {
                                        geoIpBasicInfoArray = transformToBasicInfoArray(userTrackingInfoGeoIpObjectValue);
                                    } else if ("location" in userTrackingInfoGeoIpObjectValue) {
                                        geoIpBasicInfoArray = transformToBasicInfoArray(userTrackingInfoGeoIpObjectValue);
                                        geoipLocation = {
                                            lattitude: userTrackingInfoGeoIpObjectValue.location.latitude,
                                            longitude: userTrackingInfoGeoIpObjectValue.location.longitude,
                                            accuracy_radius: userTrackingInfoGeoIpObjectValue.location.accuracy_radius,
                                            address: userTrackingInfoGeoIpObjectValue.address,
                                        };
                                    } else {
                                        geoIpBasicInfoArray = transformToBasicInfoArray(userTrackingInfoGeoIpObjectValue);
                                    }
                                }
                                let style = {};
                                if (isEmpty === true) {
                                    style = { backgroundColor: "grey" };
                                }
                                return (
                                    <Grid key={`${name}-${key}-${k}-children-${v2}-${k2}`} item xs={12} sx={{ ...style }}>
                                        <Collapse
                                            initialValue={false}
                                            triggerElement={
                                                <Typography component="span" sx={{ fontWeight: "bolder" }}>
                                                    {v2}
                                                </Typography>
                                            }
                                        >
                                            <Grid item xs={12} container spacing={2}>
                                                {isEmpty === true ? <Typography component="p">No Info found</Typography> : null}
                                                {geoipLocation !== null ? (
                                                    <Grid key={`${name}-${key}-${k}-children-${v2}-${k2}-geoip-location-button`} item xs={12}>
                                                        <Button
                                                            loading={false}
                                                            fullWidth={false}
                                                            icon={<MapIcon />}
                                                            onClick={(e) => handleMap(geoipLocation as AdminUserInfoUserTrackingGeoipLocationType)}
                                                        >
                                                            Display map for location
                                                        </Button>
                                                    </Grid>
                                                ) : null}
                                                {geoIpBasicInfoArray.length !== 0
                                                    ? displayBasicInfoArray(geoIpBasicInfoArray, `${name}-${key}-${k}-children-${v2}-${k2}`)
                                                    : null}
                                            </Grid>
                                        </Collapse>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    </Collapse>
                </Grid>
            );
        });
    };

    const displayUserTracking = (userTracking: Omit<UserTrackingEntityType, "userToken">, key: string) => {
        const { id, info, route, fingerprint, uuid } = userTracking;
        const createdAt = GetFormat(userTracking.createdAt);
        const updatedAt = GetFormat(userTracking.updatedAt);
        const userTrackingBasicInfoArray: AdminUserInfoUserTokenBasicInfoType[] = [
            { name: "id", value: id },
            { name: "route", value: route },
            { name: "fingerprint", value: fingerprint },
            { name: "uuid", value: uuid },
            { name: "Creation date", value: createdAt },
            { name: "Last update date", value: updatedAt },
        ];
        let infoArray: AdminUserInfoUserTokenBasicInfoType[] = [];
        let infoGeoIpArray: Array<{ name: string; value: UserTrackingInfoGeoIpType }> = [];
        const infoKeyArray = Object.keys(info);
        infoKeyArray.forEach((v) => {
            const infoValue = info[v as keyof UserTrackingInfoType];
            if (typeof infoValue === "string") {
                infoArray.push({ name: v, value: infoValue });
            } else if (typeof infoValue === "object" && "ASN" in infoValue) {
                infoGeoIpArray.push({ name: v, value: infoValue });
            }
        });
        return (
            <Grid key={`${key}-usertracking-${id}`} item xs={12}>
                <Collapse
                    initialValue={false}
                    triggerElement={
                        <Typography component="span">
                            <span style={{ fontWeight: "bolder" }}>{route}</span>
                            <span>{" : "}</span>
                            <span style={{ fontWeight: "bolder" }}>{createdAt}</span>
                        </Typography>
                    }
                >
                    <Grid item xs={12} container spacing={2} sx={{ marginBottom: (theme) => theme.spacing(1) }}>
                        {displayBasicInfoArray(userTrackingBasicInfoArray, `${key}-usertracking-${id}`)}
                        <Grid key={`${key}-usertracking-${id}-info-grid`} item xs={12}>
                            <Collapse
                                initialValue={false}
                                triggerElement={
                                    <Typography component="span" sx={{ fontWeight: "bolder" }}>
                                        Info
                                    </Typography>
                                }
                            >
                                <Grid item xs={12} container spacing={2} sx={{ marginBottom: (theme) => theme.spacing(1) }}>
                                    {displayBasicInfoArray(infoArray, `${key}-usertracking-${id}-info`)}
                                    {displayGeoIpInfoArray(infoGeoIpArray, `${key}-usertracking-${id}-info-geoip`)}
                                </Grid>
                            </Collapse>
                        </Grid>
                    </Grid>
                </Collapse>
            </Grid>
        );
    };

    const displayDeleteIcon = (idUserToken: number) => {
        return (
            <Dialog
                name={`revoke-token-${idUserToken}`}
                title="Revoke Token"
                elementTrigger={<DeleteIcon color="error" />}
                confirm
                confirmYes={() => userRevokeTokenReq(idUserToken)}
            >
                {`If it's your current token you will be disconnected`}
            </Dialog>
        );
    };

    const displayUserToken = (userToken: UserGetAllUserInfoUserTokenType, userTokenKey: number) => {
        const { id, token, userTrackings, nbUsage, deletedAt } = userToken;
        const createdAt = GetFormat(userToken.createdAt);
        const updatedAt = GetFormat(userToken.updatedAt);
        const expiratedAt = GetFormat(userToken.expiratedAt);
        const userTokenBasicInfoArray: AdminUserInfoUserTokenBasicInfoType[] = [
            { name: "id", value: id },
            { name: "usage", value: nbUsage },
            { name: "token", value: token },
            { name: "creation date", value: createdAt },
            { name: "last updated date", value: updatedAt },
            { name: "expiration date", value: expiratedAt },
        ];
        let collapseTextContent = (
            <>
                <span>{"used "}</span>
                <span style={{ fontWeight: "bolder" }}>{`${nbUsage} `}</span>
                <span>{Pluralize("time", nbUsage)}</span>
                <span style={{ fontWeight: "bolder" }}>{` ${createdAt}`}</span>
                <span>{" -> "}</span>
                <span style={{ fontWeight: "bolder" }}>{expiratedAt}</span>
            </>
        );
        let style = {};
        let collapseTextDeleteContent = <></>;
        if (deletedAt !== null) {
            style = { backgroundColor: "red" };
            collapseTextDeleteContent = (
                <>
                    <span>{" X> "}</span>
                    <span style={{ fontWeight: "bolder" }}>{GetFormat(deletedAt)}</span>
                </>
            );
        }
        return (
            <Grid
                key={`parent-grid-user-token-${id}-${userTokenKey}`}
                item
                xs={12}
                container
                spacing={2}
                sx={{ marginTop: (theme) => theme.spacing(1) }}
            >
                <Grid item xs={12} sx={{ ...style }}>
                    <Collapse
                        initialValue={false}
                        triggerElement={
                            <Typography component="span">
                                {collapseTextContent} {collapseTextDeleteContent} {deletedAt === null ? displayDeleteIcon(id) : null}
                            </Typography>
                        }
                    >
                        <Grid item xs={12} container spacing={2} sx={{ marginBottom: (theme) => theme.spacing(1) }}>
                            {displayBasicInfoArray(userTokenBasicInfoArray, `${id}-${userTokenKey}`)}
                            <Grid key={`usertoken-${id}-user-tracking`} item xs={12}>
                                <Collapse
                                    initialValue={false}
                                    triggerElement={
                                        <Typography component="span" sx={{ fontWeight: "bolder" }}>
                                            User Tracking
                                        </Typography>
                                    }
                                >
                                    <Grid item xs={12} container spacing={2} sx={{ marginTop: (theme) => theme.spacing(1) }}>
                                        {userTrackings.map((userTracking, userTrackingKey) => {
                                            return displayUserTracking(userTracking, `${id}-${userTokenKey}-${userTrackingKey}`);
                                        })}
                                    </Grid>
                                </Collapse>
                            </Grid>
                        </Grid>
                    </Collapse>
                </Grid>
            </Grid>
        );
    };

    const displayUserInfo = (userInfo: UserGetAdminInfoType) => {
        const { id, username, createdAt, updatedAt, role, userTokens } = userInfo;
        const isAdmin = AdminName === role;
        return (
            <Grid key={`grid-userinfo-${id}`} item xs={12} container spacing={2}>
                <Grid item xs={12} md={4}>
                    <Typography component="p">
                        <span style={spanStyle}>Id: </span>
                        <span>{id}</span>
                    </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Typography component="p">
                        <span style={spanStyle}>Username: </span>
                        <span>{username}</span>
                    </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Typography component="p">
                        <span style={spanStyle}>Is an Admin: </span>
                        <span>{isAdmin === true ? "yes" : "no"}</span>
                    </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Typography component="p">
                        <span style={spanStyle}>Creation date: </span>
                        <span>{GetFormat(createdAt)}</span>
                    </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Typography component="p">
                        <span style={spanStyle}>Last Update date: </span>
                        <span>{GetFormat(updatedAt)}</span>
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Collapse
                        initialValue={false}
                        triggerElement={
                            <Typography component="span">
                                <span style={{ fontWeight: "bolder" }}>{`${username} `}</span>
                                <span>{`have `}</span>
                                <span style={{ fontWeight: "bolder" }}>{`${userTokens.length} ${Pluralize("token", userTokens.length)}`}</span>
                            </Typography>
                        }
                    >
                        <Grid item xs={12} container spacing={2}>
                            {userTokens.map((userToken, userTokenKey) => {
                                return displayUserToken(userToken, userTokenKey);
                            })}
                        </Grid>
                    </Collapse>
                </Grid>
            </Grid>
        );
    };

    return (
        <DashboardHome active={6} title="Admin User info page">
            <Dialog fullWidth={true} name="user-info-map" openState={[openMap, setOpenMap]} elementTrigger="" title="">
                {geoipLocation !== null ? (
                    <LeafletMap
                        lattitude={geoipLocation.lattitude}
                        longitude={geoipLocation.longitude}
                        radius={geoipLocation.accuracy_radius}
                        popupText={geoipLocation.address}
                    />
                ) : (
                    <Typography component="p">No GeoIp location is given</Typography>
                )}
            </Dialog>
            <Grid item xs={12} container spacing={2} sx={{ marginTop: (theme) => theme.spacing(2) }}>
                {loading === true ? (
                    <Skeleton animation="wave" variant="rounded" width="100%" height="50vh" />
                ) : user !== null ? (
                    displayUserInfo(user)
                ) : (
                    <Grid item xs={12}>
                        <Typography component="p">No user found !!</Typography>
                    </Grid>
                )}
            </Grid>
        </DashboardHome>
    );
}
