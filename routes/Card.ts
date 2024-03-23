import { GetFullRouteFromRouteNameAndRouteOption } from "@utils/Route";
export enum CardRouteName {
    SEARCH = "search",
    INFO = "info",
}

export const CARD_ROUTE_JSON = {
    [CardRouteName.SEARCH]: "/search",
    [CardRouteName.INFO]: "/info/{uuid}/{slugName}",
};

export const CARD_BASE_URL = "/card";

type CardRouteOptionKey = "uuid" | "slugName";

type CardRouteOption = {
    [key in CardRouteOptionKey]: string;
}

export function GetFullRoute(cardRouteName: CardRouteName, option: CardRouteOption | null = null): string {
    let url = `${CARD_BASE_URL}${CARD_ROUTE_JSON[cardRouteName]}`;
    return GetFullRouteFromRouteNameAndRouteOption<CardRouteOption>(url, option);
}