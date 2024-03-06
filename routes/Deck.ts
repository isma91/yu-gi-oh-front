export enum DeckRouteName {
    LIST = "list",
    CREATE = "create",
}

export const DECK_ROUTE_JSON = {
    [DeckRouteName.LIST]: "/list",
    [DeckRouteName.CREATE]: "/create",
};

export const DECK_BASE_URL = "/deck";