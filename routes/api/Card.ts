import { GetFullRouteFromRouteNameAndRouteOption } from "@utils/Route";

export enum CardApiRouteName {
    GET_INFO = "get-info",
    RANDOM = "random",
}

const CARD_API_ROUTE_JSON = {
    [CardApiRouteName.GET_INFO]: "/info/{uuid}",
    [CardApiRouteName.RANDOM]: "/random",
};

export const CARD_API_BASE_URL = "/card";

type CardApiRouteOptionKey = "uuid";

type CardApiRouteOption = {
    [key in CardApiRouteOptionKey]?: string;
}

export function GetFullRoute(name: CardApiRouteName, option: CardApiRouteOption | null = null): string {
    let url = `${CARD_API_BASE_URL}${CARD_API_ROUTE_JSON[name]}`;
    return GetFullRouteFromRouteNameAndRouteOption(url, option);
}