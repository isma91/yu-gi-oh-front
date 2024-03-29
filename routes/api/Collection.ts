import { GetFullRouteFromRouteNameAndRouteOption } from "@utils/Route";

export enum CollectionApiRouteName {
    CREATE = "create",
    GET_INFO = "info",
    DELETE = "delete",
    UPDATE_PUBLIC = "update-public",
    EDIT = "edit",
}

const COLLECTION_API_ROUTE_JSON = {
    [CollectionApiRouteName.CREATE]: "/create",
    [CollectionApiRouteName.GET_INFO]: "/info/{id}",
    [CollectionApiRouteName.DELETE]: "/delete/{id}",
    [CollectionApiRouteName.UPDATE_PUBLIC]: "/update-public/{id}/{public}",
    [CollectionApiRouteName.EDIT]: "/edit/{id}",
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