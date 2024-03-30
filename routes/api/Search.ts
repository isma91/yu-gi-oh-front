export enum SearchApiRouteName {
    CARD = "card",
    SET = "set",
    LIST_DECK_CURRENT_USER = "list-deck-from-current-user",
    LIST_COLLECTION_CURRENT_USER = "list-collection-from-current-user",
}

const SEARCH_API_ROUTE_JSON = {
    [SearchApiRouteName.CARD]: "/card",
    [SearchApiRouteName.SET]: "/set",
    [SearchApiRouteName.LIST_DECK_CURRENT_USER]: "/deck-current-user",
    [SearchApiRouteName.LIST_COLLECTION_CURRENT_USER]: "/collection-current-user",
};

export const SEARCH_API_BASE_URL = "/search";

export function GetFullRoute(name: SearchApiRouteName): string {
    return `${SEARCH_API_BASE_URL}${SEARCH_API_ROUTE_JSON[name]}`;
}