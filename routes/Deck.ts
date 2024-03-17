import { GetFullRouteFromRouteNameAndRouteOption } from "@utils/Route";

export enum DeckRouteName {
    LIST = "list",
    CREATE = "create",
}

export const DECK_ROUTE_JSON = {
    [DeckRouteName.LIST]: "/list",
    [DeckRouteName.CREATE]: "/create",
};

export const DECK_BASE_URL = "/deck";

export function GetFullRoute(deckRouteName: DeckRouteName, option: null = null): string {
    let url = `${DECK_BASE_URL}${DECK_ROUTE_JSON[deckRouteName]}`;
    return GetFullRouteFromRouteNameAndRouteOption(url, option);
}