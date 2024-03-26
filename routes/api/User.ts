import { GetFullRouteFromRouteNameAndRouteOption } from "@utils/Route";

export enum UserApiRouteName {
    CREATE = "create",
    GET_ALL = "get_all",
    LOGIN = "login",
    REFRESH_LOGIN = "refresh-login",
    LOGOUT = "logout",
    EDIT_PASSWORD = "edit-password",
    EDIT_USERNAME = "edit-username",
    GET_BASIC_INFO = "basic-info",
}

const USER_API_ROUTE_JSON = {
    [UserApiRouteName.CREATE]: "/create",
    [UserApiRouteName.GET_ALL]: "/all",
    [UserApiRouteName.LOGIN]: "/login",
    [UserApiRouteName.REFRESH_LOGIN]: "/refresh-login",
    [UserApiRouteName.LOGOUT]: "/logout",
    [UserApiRouteName.EDIT_PASSWORD]: "/edit-password",
    [UserApiRouteName.EDIT_USERNAME]: "/edit-username/{username}",
    [UserApiRouteName.GET_BASIC_INFO]: "/basic-info",
};

export const USER_API_BASE_URL = "/user";

type UserApiRouteOptionKey = "username";

type UserApiRouteOption = {
    [key in UserApiRouteOptionKey]?: string;
}

export function GetFullRoute(name: UserApiRouteName, option: UserApiRouteOption | null = null): string {
    const url = `${USER_API_BASE_URL}${USER_API_ROUTE_JSON[name]}`;
    return GetFullRouteFromRouteNameAndRouteOption(url, option);
}