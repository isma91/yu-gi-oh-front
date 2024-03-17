export enum DeckApiRouteName {
    CREATE = "create",
    LIST_CURRENT_USER = "list-from-current-user",
}

const DECK_API_ROUTE_JSON = {
    [DeckApiRouteName.CREATE]: "/create",
    [DeckApiRouteName.LIST_CURRENT_USER]: "/list",
};

export const DECK_API_BASE_URL = "/deck";

export function GetFullRoute(name: DeckApiRouteName): string {
    return `${DECK_API_BASE_URL}${DECK_API_ROUTE_JSON[name]}`;
}