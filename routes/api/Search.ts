export enum SearchApiRouteName {
    CARD = "card",
    SET = "set",
    LIST_CURRENT_USER = "list-from-current-user",
}

const SEARCH_API_ROUTE_JSON = {
    [SearchApiRouteName.CARD]: "/card",
    [SearchApiRouteName.SET]: "/set",
    [SearchApiRouteName.LIST_CURRENT_USER]: "/deck-current-user",
};

export const SEARCH_API_BASE_URL = "/search";

export function GetFullRoute(name: SearchApiRouteName): string {
    return `${SEARCH_API_BASE_URL}${SEARCH_API_ROUTE_JSON[name]}`;
}