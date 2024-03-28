import { GetFullRouteFromRouteNameAndRouteOption } from "@utils/Route";

export enum CollectionApiRouteName {
    CREATE = "create",
    GET_INFO = "info",
}

const COLLECTION_API_ROUTE_JSON = {
    [CollectionApiRouteName.CREATE]: "/create",
    [CollectionApiRouteName.GET_INFO]: "/info/{id}",
};

export const COLLECTION_API_BASE_URL = "/card-collection";

type CollectionApiRouteOptionKey = "id" | "public";

type CollectionApiRouteOption = {
    [key in CollectionApiRouteOptionKey]?: string;
}

export function GetFullRoute(name: CollectionApiRouteName, option: CollectionApiRouteOption | null = null): string {
    let url = `${COLLECTION_API_BASE_URL}${COLLECTION_API_ROUTE_JSON[name]}`;
    return GetFullRouteFromRouteNameAndRouteOption(url, option);
}