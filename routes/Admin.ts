import { GetFullRouteFromRouteNameAndRouteOption } from "@utils/Route";
export enum AdminRouteName {
    BASE = "base",
    USER_INFO = "user-info",
}

export const ADMIN_ROUTE_JSON = {
    [AdminRouteName.BASE]: "/",
    [AdminRouteName.USER_INFO]: "/user/{id}-{username}",
};

export const ADMIN_BASE_URL = "/admin";

type AdminRouteOptionKey = "id" | "username";

type AdminRouteOption = {
    [key in AdminRouteOptionKey]?: string;
}

export function GetFullRoute(adminRouteName: AdminRouteName, option: AdminRouteOption | null = null): string {
    let url = `${ADMIN_BASE_URL}${ADMIN_ROUTE_JSON[adminRouteName]}`;
    return GetFullRouteFromRouteNameAndRouteOption<AdminRouteOption>(url, option);
}