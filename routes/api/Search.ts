export enum SearchApiRouteName {
    CARD = "card",
    LIST_CURRENT_USER = "list-from-current-user",
}

const SEARCH_API_ROUTE_JSON = {
    [SearchApiRouteName.CARD]: "/card",
    [SearchApiRouteName.LIST_CURRENT_USER]: "/deck-current-user",
};

export const SEARCH_API_BASE_URL = "/search";

export function GetFullRoute(name: SearchApiRouteName): string {
    return `${SEARCH_API_BASE_URL}${SEARCH_API_ROUTE_JSON[name]}`;
}