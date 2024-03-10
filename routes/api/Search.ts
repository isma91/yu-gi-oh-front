export enum SearchApiRouteName {
    CARD = "card",
}

const SEARCH_API_ROUTE_JSON = {
    [SearchApiRouteName.CARD]: "/card",
};

export const SEARCH_API_BASE_URL = "/search";

export function GetFullRoute(name: SearchApiRouteName): string {
    return `${SEARCH_API_BASE_URL}${SEARCH_API_ROUTE_JSON[name]}`;
}