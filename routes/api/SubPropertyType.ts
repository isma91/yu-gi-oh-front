export enum SubPropertyTypeApiRouteName {
    GET_ALL = "get-all",
}

const SUB_PROPERTY_TYPE_API_ROUTE_JSON = {
    [SubPropertyTypeApiRouteName.GET_ALL]: "/all",
};

export const SUB_PROPERTY_TYPE_API_BASE_URL = "/sub-property-type";

export function GetFullRoute(name: SubPropertyTypeApiRouteName): string {
    return `${SUB_PROPERTY_TYPE_API_BASE_URL}${SUB_PROPERTY_TYPE_API_ROUTE_JSON[name]}`;
}