import { GetFullRouteFromRouteNameAndRouteOption } from "@utils/Route";

export enum DeckApiRouteName {
    CREATE = "create",
    GET_INFO = "info",
    DELETE = "delete",
    
}

const DECK_API_ROUTE_JSON = {
    [DeckApiRouteName.CREATE]: "/create",
    [DeckApiRouteName.GET_INFO]: "/info/{id}",
    [DeckApiRouteName.DELETE]: "/delete/{id}",
};

export const DECK_API_BASE_URL = "/deck";

type DeckApiRouteOptionKey = "id";

type DeckApiRouteOption = {
    [key in DeckApiRouteOptionKey]: string;
}

export function GetFullRoute(name: DeckApiRouteName, option: DeckApiRouteOption | null = null): string {
    let url = `${DECK_API_BASE_URL}${DECK_API_ROUTE_JSON[name]}`;
    return GetFullRouteFromRouteNameAndRouteOption(url, option);
}