import { GetFullRouteFromRouteNameAndRouteOption } from "@utils/Route";

export enum SetApiRouteName {
    GET_INFO = "info"
}

const SET_API_ROUTE_JSON = {
    [SetApiRouteName.GET_INFO]: "/info/{id}",
};

export const SET_API_BASE_URL = "/set";

type SetApiRouteOptionKey = "id";

type SetApiRouteOption = {
    [key in SetApiRouteOptionKey]?: string;
}

export function GetFullRoute(name: SetApiRouteName, option: SetApiRouteOption | null = null): string {
    const url = `${SET_API_BASE_URL}${SET_API_ROUTE_JSON[name]}`;
    return GetFullRouteFromRouteNameAndRouteOption(url, option);
}