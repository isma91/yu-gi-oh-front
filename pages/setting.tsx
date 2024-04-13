import { useState, useEffect, useContext } from "react";
import { StoreContext } from "@app/lib/state-provider";
import { enqueueSnackbar } from "notistack";
import useEnhancedMediaQuery from "@app/hooks/useEnhanceMediaQuery";
import { Grid, Typography, useTheme } from "@mui/material";
import DashboardHome from "@components/dashboard/Home";
import Collapse from "@components/display/Collapse";
import EditPasswordForm from "@form/user/edit-password";
import EditUsernameForm from "@form/user/edit-username";
import UserGetAllUserTokenRequest from "@api/User/Auth/GetAllUserToken";
import { UserGetAllUserTokenType } from "@app/types/entity/User";
import { GetFormat } from "@utils/Date";
import { TableContentType, TableContentTypeType, TableHeaderType } from "@app/types/Table";
import Table from "@components/display/Table";
import Button from "@components/field/Button";
import Dialog from "@components/display/Dialog";
import MapIcon from "@mui/icons-material/Map";
import DeleteIcon from "@mui/icons-material/Delete";
import dynamic from "next/dynamic";
import UserRevokeTokenRequest from "@api/User/Auth/RevokeToken";

type SettingGeoipLocationType = UserGetAllUserTokenType["geoip"] & {
    address: UserGetAllUserTokenType["address"];
};

export default function SettingPage() {
    const LeafletMap = dynamic(() => import("@components/display/Leaflet"), { ssr: false });
    const { state: globalState } = useContext(StoreContext);
    const Theme = useTheme();
    const { value: mediaQueryUpMd, loading: loadingMediaQueryUpMd } = useEnhancedMediaQuery(Theme.breakpoints.up("md"));
    const [openMap, setOpenMap] = useState<boolean>(false);
    const [geoipLocation, setGeoipLocation] = useState<SettingGeoipLocationType | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [skip, setSkip] = useState<boolean>(false);
    const [userToken, setUserToken] = useState<Array<TableContentType[]>>([]);
    const [userTokenHeader, setUserTokenHeader] = useState<TableHeaderType[]>([]);
    const [userTokenToRevoke, setUserTokenToRevoke] = useState<number | null>(null);

    const sendUserGetAllUserTokenReq = async () => {
        return UserGetAllUserTokenRequest()
            .then((res) => {
                setUserToken(parseUserToken(res.data.userToken));
                let header: TableHeaderType[] = [
                    { name: "Usage", field: "nbUsage" },
                    { name: "Expiration date", field: "expiratedAt" },
                    { name: "Map", field: "map" },
                    { name: "Revoke Token", field: "revokeToken" },
                ];
                if (mediaQueryUpMd === true) {
                    header = [
                        { name: "Ip", field: "ip" },
                        { name: "Most precise Ip", field: "mostPreciseIp" },
                        { name: "Usage", field: "nbUsage" },
                        { name: "Expiration date", field: "expiratedAt" },
                        { name: "Creation date", field: "createdAt" },
                        { name: "Map", field: "map" },
                        { name: "Revoke Token", field: "revokeToken" },
                    ];
                }
                setUserTokenHeader(header);
            })
            .catch((err) => enqueueSnackbar(err, { variant: "error" }))
            .finally(() => {
                setLoading(false);
                setSkip(true);
            });
    };

    const findIndexElementInTable = (fieldName: string, fieldValue: string | number): number | null => {
        let index = null;
        loop1: for (let i = 0; i < userToken.length; i++) {
            const el = userToken[i];
            for (let j = 0; j < el.length; j++) {
                const el2 = el[j];
                if (el2.field === fieldName && el2.value === fieldValue) {
                    index = i;
                    break loop1;
                }
            }
        }
        return index;
    };

    const userRevokeTokenReq = async (id: number) => {
        setLoading(true);
        return UserRevokeTokenRequest(id)
            .then((res) => {
                enqueueSnackbar(res.success, { variant: "success" });
                const index = findIndexElementInTable("id", id);
                if (index !== null) {
                    setUserToken((prevState) => {
                        let newUserToken = [...prevState];
                        newUserToken.splice(index, 1);
                        return newUserToken;
                    });
                }
            })
            .catch((err) => enqueueSnackbar(err, { variant: "error" }))
            .finally(() => {
                setLoading(false);
                setUserTokenToRevoke(null);
            });
    };

    useEffect(() => {
        if (globalState.user !== null && skip === false && loadingMediaQueryUpMd === false) {
            sendUserGetAllUserTokenReq();
        }
    }, [globalState, skip, loadingMediaQueryUpMd]);

    useEffect(() => {
        if (userTokenToRevoke !== null) {
            userRevokeTokenReq(userTokenToRevoke);
        }
    }, [userTokenToRevoke]);

    const parseUserToken = (data: UserGetAllUserTokenType[]): Array<TableContentType[]> => {
        let newUserToken: Array<TableContentType[]> = [];
        for (let i = 0; i < data.length; i++) {
            const el = data[i];
            newUserToken.push(parseUniqueUserToken(el));
        }
        return newUserToken;
    };

    const handleMap = (geoip: SettingGeoipLocationType | null) => {
        if (geoip !== null) {
            setGeoipLocation(geoip);
            setOpenMap(true);
        }
    };

    const parseUniqueUserToken = (data: UserGetAllUserTokenType): TableContentType[] => {
        let { id, nbUsage, ip, mostPreciseIp, address, geoip, expiratedAt, createdAt } = data;
        if (ip === null) {
            ip = "Cannot find Ip address";
        }
        if (mostPreciseIp === null) {
            mostPreciseIp = "Cannot find a precise Ip address";
        }
        const disableMapButton = geoip === null;
        let userTokenGeoip: SettingGeoipLocationType | null = null;
        if (geoip !== null) {
            userTokenGeoip = {
                ...geoip,
                address: address,
            };
        }
        return [
            {
                field: "id",
                value: id,
            },
            {
                field: "ip",
                value: ip,
            },
            {
                field: "mostPreciseIp",
                value: mostPreciseIp,
            },
            {
                field: "nbUsage",
                value: nbUsage,
            },
            {
                field: "expiratedAt",
                value: GetFormat(expiratedAt),
            },
            {
                field: "createdAt",
                value: GetFormat(createdAt),
            },
            {
                field: "map",
                type: TableContentTypeType.ACTION,
                value: (
                    <Button
                        loading={false}
                        fullWidth={false}
                        icon={<MapIcon />}
                        disabled={disableMapButton}
                        onClick={() => handleMap(userTokenGeoip)}
                    >
                        {geoip === null ? "No geo ip info" : "display map for location"}
                    </Button>
                ),
            },
            {
                field: "revokeToken",
                type: TableContentTypeType.ACTION,
                value: (
                    <Dialog
                        name={`revole-token-${id}`}
                        title="Revoke Token"
                        elementTrigger={
                            <Button color="error" loading={false} fullWidth={false} icon={<DeleteIcon color="error" />}>
                                Revoke Token
                            </Button>
                        }
                        confirm
                        confirmYes={() => setUserTokenToRevoke(id)}
                    >
                        If it's your current token you will be disconnected
                    </Dialog>
                ),
            },
        ];
    };

    return (
        <DashboardHome active={5} title="Setting Page">
            <Grid item xs={12} container spacing={2} sx={{ marginTop: (theme) => theme.spacing(2) }}>
                <Grid item xs={12} sx={{ textAlign: "center" }}>
                    <Collapse triggerElement={<Typography component="span">Change your Password</Typography>}>
                        <Grid item xs={12} container spacing={2} justifyContent="center">
                            <EditPasswordForm />
                        </Grid>
                    </Collapse>
                </Grid>
                <Grid item xs={12} sx={{ textAlign: "center" }}>
                    <Collapse triggerElement={<Typography component="span">Change your Username</Typography>}>
                        <Grid item xs={12} container spacing={2} justifyContent="center">
                            <EditUsernameForm />
                        </Grid>
                    </Collapse>
                </Grid>
                <Dialog fullWidth={true} name="user-info-map" openState={[openMap, setOpenMap]} elementTrigger="" title="">
                    {geoipLocation !== null ? (
                        <LeafletMap
                            lattitude={geoipLocation.latitude}
                            longitude={geoipLocation.longitude}
                            radius={geoipLocation.accuracy_radius}
                            popupText={geoipLocation.address}
                        />
                    ) : (
                        <Typography component="p">No GeoIp location is given</Typography>
                    )}
                </Dialog>
                <Grid item xs={12} sx={{ textAlign: "center" }}>
                    <Collapse triggerElement={<Typography component="span">List of available token</Typography>}>
                        <Grid item xs={12} container spacing={2} justifyContent="center">
                            <Table name="user" header={userTokenHeader} loading={loading} content={userToken} />
                        </Grid>
                    </Collapse>
                </Grid>
            </Grid>
        </DashboardHome>
    );
}
