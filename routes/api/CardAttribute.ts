export enum CardAttributeApiRouteName {
    GET_ALL = "get-all",
}

const CARD_ATTRIBUTE_API_ROUTE_JSON = {
    [CardAttributeApiRouteName.GET_ALL]: "/all",
};

export const CARD_ATTRIBUTE_API_BASE_URL = "/card-attribute";

export function GetFullRoute(name: CardAttributeApiRouteName): string {
    return `${CARD_ATTRIBUTE_API_BASE_URL}${CARD_ATTRIBUTE_API_ROUTE_JSON[name]}`;
}