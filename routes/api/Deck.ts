export enum DeckApiRouteName {
    CREATE = "create",
    
}

const DECK_API_ROUTE_JSON = {
    [DeckApiRouteName.CREATE]: "/create",
};

export const DECK_API_BASE_URL = "/deck";

export function GetFullRoute(name: DeckApiRouteName): string {
    return `${DECK_API_BASE_URL}${DECK_API_ROUTE_JSON[name]}`;
}