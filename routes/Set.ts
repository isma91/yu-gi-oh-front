import { GetFullRouteFromRouteNameAndRouteOption } from "@utils/Route";
export enum SetRouteName {
    SEARCH = "search",
    INFO = "info",
}

export const SET_ROUTE_JSON = {
    [SetRouteName.SEARCH]: "/search",
    [SetRouteName.INFO]: "/info/{id}/{slugName}",
};

export const SET_BASE_URL = "/set";

type SetRouteOptionKey = "id" | "slugName";

type SetRouteOption = {
    [key in SetRouteOptionKey]?: string;
}

export function GetFullRoute(setRouteName: SetRouteName, option: SetRouteOption | null = null): string {
    let url = `${SET_BASE_URL}${SET_ROUTE_JSON[setRouteName]}`;
    return GetFullRouteFromRouteNameAndRouteOption<SetRouteOption>(url, option);
}