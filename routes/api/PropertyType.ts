export enum PropertyTypeApiRouteName {
    GET_ALL = "get-all",
}

const PROPERTY_TYPE_API_ROUTE_JSON = {
    [PropertyTypeApiRouteName.GET_ALL]: "/all",
};

export const PROPERTY_TYPE_API_BASE_URL = "/property-type";

export function GetFullRoute(name: PropertyTypeApiRouteName): string {
    return `${PROPERTY_TYPE_API_BASE_URL}${PROPERTY_TYPE_API_ROUTE_JSON[name]}`;
}