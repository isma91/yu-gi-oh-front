export enum CategoryApiRouteName {
    GET_ALL = "get-all",
}

const CATEGORY_API_ROUTE_JSON = {
    [CategoryApiRouteName.GET_ALL]: "/all",
};

export const CATEGORY_API_BASE_URL = "/category";

export function GetFullRoute(name: CategoryApiRouteName): string {
    return `${CATEGORY_API_BASE_URL}${CATEGORY_API_ROUTE_JSON[name]}`;
}