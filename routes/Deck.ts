import { GetFullRouteFromRouteNameAndRouteOption } from "@utils/Route";

export enum DeckRouteName {
    LIST = "list",
    CREATE = "create",
    INFO = "info",
}

export const DECK_ROUTE_JSON = {
    [DeckRouteName.LIST]: "/list",
    [DeckRouteName.CREATE]: "/create",
    [DeckRouteName.INFO]: "/info/{id}/{slugName}",
};

export const DECK_BASE_URL = "/deck";

type DeckRouteOptionKey = "id" | "slugName";

type DeckRouteOption = {
    [key in DeckRouteOptionKey]: string;
}

export function GetFullRoute(deckRouteName: DeckRouteName, option: null | DeckRouteOption = null): string {
    let url = `${DECK_BASE_URL}${DECK_ROUTE_JSON[deckRouteName]}`;
    return GetFullRouteFromRouteNameAndRouteOption<DeckRouteOption>(url, option);
}