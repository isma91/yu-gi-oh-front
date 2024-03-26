export enum CountryApiRouteName {
    GET_ALL = "get-all",
}

const COUNTRY_API_ROUTE_JSON = {
    [CountryApiRouteName.GET_ALL]: "/all",
};

export const COUNTRY_API_BASE_URL = "/country";

export function GetFullRoute(name: CountryApiRouteName): string {
    return `${COUNTRY_API_BASE_URL}${COUNTRY_API_ROUTE_JSON[name]}`;
}