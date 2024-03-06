export enum UserApiRouteName {
    CREATE = "create",
    GET_ALL = "get_all",
    LOGIN = "login",
    REFRESH_LOGIN = "refresh-login",
    LOGOUT = "logout",
}

const USER_API_ROUTE_JSON = {
    [UserApiRouteName.CREATE]: "/create",
    [UserApiRouteName.GET_ALL]: "/all",
    [UserApiRouteName.LOGIN]: "/login",
    [UserApiRouteName.REFRESH_LOGIN]: "/refresh-login",
    [UserApiRouteName.LOGOUT]: "/logout",
};

export const USER_API_BASE_URL = "/user";

export function GetFullRoute(name: UserApiRouteName): string {
    return `${USER_API_BASE_URL}${USER_API_ROUTE_JSON[name]}`;
}