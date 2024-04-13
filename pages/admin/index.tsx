import { useState, useContext, useEffect, useCallback } from "react";
import DashboardHome from "@components/dashboard/Home";
import { Grid, useTheme } from "@mui/material";
import { StoreContext } from "@app/lib/state-provider";
import { enqueueSnackbar } from "notistack";
import useEnhancedMediaQuery from "@app/hooks/useEnhanceMediaQuery";
import { TableContentType, TableHeaderType } from "@app/types/Table";
import UserGetAllUserInfoRequest from "@api/User/GetAllUserInfo";
import { UserGetAllUserInfoType } from "@app/types/entity/User";
import { Pluralize } from "@utils/String";
import { GetFormat } from "@utils/Date";
import Table from "@components/display/Table";
import { AddRowAction } from "@utils/Table";
import AdminName from "@app/.admin-name";
import { AdminRouteName, GetFullRoute } from "@routes/Admin";

export default function AdminIndexPage() {
    const { state: globalState } = useContext(StoreContext);
    const Theme = useTheme();
    const enhanceMediaQuery = useEnhancedMediaQuery(Theme.breakpoints.up("md"));
    const [user, setUser] = useState<Array<TableContentType[]>>([]);
    const [userHeader, setUserHeader] = useState<TableHeaderType[]>([]);
    const [loadingUser, setLoadingUser] = useState<boolean>(true);
    const [skipUser, setSkipUser] = useState<boolean>(false);
    const parseUniqueUser = useCallback((data: UserGetAllUserInfoType): TableContentType[] => {
        const { id, username, userTokenCount, createdAt, updatedAt, role } = data;
        const isAdmin = AdminName === role;
        return [
            {
                field: "id",
                value: id,
            },
            {
                field: "username",
                value: username,
            },
            {
                field: "isAdmin",
                value: isAdmin === true ? "yes" : "no",
            },
            {
                field: "userTokenCount",
                value: `${userTokenCount} ${Pluralize("token", userTokenCount)}`,
                search: userTokenCount,
            },
            {
                field: "createdAt",
                value: GetFormat(createdAt),
            },
            {
                field: "updatedAt",
                value: GetFormat(updatedAt),
            },
            AddRowAction(GetFullRoute(AdminRouteName.USER_INFO, { id: id.toString(10), username: username })),
        ];
    }, []);
    const parseUser = useCallback(
        (data: UserGetAllUserInfoType[]) => {
            let newUser: Array<TableContentType[]> = [];
            for (let i = 0; i < data.length; i++) {
                const el = data[i];
                newUser.push(parseUniqueUser(el));
            }
            return newUser;
        },
        [parseUniqueUser]
    );

    useEffect(() => {
        if (globalState.user !== null && skipUser === false && enhanceMediaQuery.loading === false) {
            UserGetAllUserInfoRequest()
                .then((res) => {
                    setUser(parseUser(res.data.user));
                    let header: TableHeaderType[] = [
                        { name: "Username", field: "username" },
                        { name: "UserToken Number", field: "userTokenCount" },
                        { name: "Creation Date", field: "createdAt" },
                        { name: "Last Update Date", field: "updatedAt" },
                    ];
                    if (enhanceMediaQuery.value === true) {
                        header = [
                            { name: "ID", field: "id" },
                            { name: "Username", field: "username" },
                            { name: "Is Admin", field: "isAdmin" },
                            { name: "UserToken Number", field: "userTokenCount" },
                            { name: "Creation Date", field: "createdAt" },
                            { name: "Last Update Date", field: "updatedAt" },
                        ];
                    }
                    setUserHeader(header);
                })
                .catch((err) => {
                    enqueueSnackbar(err, { variant: "error" });
                })
                .finally(() => {
                    setLoadingUser(false);
                    setSkipUser(true);
                });
        }
    }, [globalState, skipUser, enhanceMediaQuery, parseUser]);

    return (
        <DashboardHome active={6} title="Admin Page">
            <Grid item xs={12} container spacing={0}>
                <Grid item xs={12}>
                    <Table name="user" header={userHeader} loading={loadingUser} content={user} />
                </Grid>
            </Grid>
        </DashboardHome>
    );
}
