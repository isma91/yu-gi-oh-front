export enum TypeApiRouteName {
    GET_ALL = "get-all",
}

const TYPE_API_ROUTE_JSON = {
    [TypeApiRouteName.GET_ALL]: "/all",
};

export const TYPE_API_BASE_URL = "/type";

export function GetFullRoute(name: TypeApiRouteName): string {
    return `${TYPE_API_BASE_URL}${TYPE_API_ROUTE_JSON[name]}`;
}