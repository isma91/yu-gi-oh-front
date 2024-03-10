export enum SubTypeApiRouteName {
    GET_ALL = "get-all",
}

const SUB_TYPE_API_ROUTE_JSON = {
    [SubTypeApiRouteName.GET_ALL]: "/all",
};

export const SUB_TYPE_API_BASE_URL = "/sub-type";

export function GetFullRoute(name: SubTypeApiRouteName): string {
    return `${SUB_TYPE_API_BASE_URL}${SUB_TYPE_API_ROUTE_JSON[name]}`;
}