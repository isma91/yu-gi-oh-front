import { GetFullRouteFromRouteNameAndRouteOption } from "@utils/Route";

export enum CollectionRouteName {
    LIST = "list",
    CREATE = "create",
    INFO = "info",
}

export const COLLECTION_ROUTE_JSON = {
    [CollectionRouteName.LIST]: "/list",
    [CollectionRouteName.CREATE]: "/create",
    [CollectionRouteName.INFO]: "/info/{id}/{slugName}",
};

export const COLLECTION_BASE_URL = "/collection";


type CollectionRouteOptionKey = "id" | "slugName";

type CollectionRouteOption = {
    [key in CollectionRouteOptionKey]: string;
}

export function GetFullRoute(collectionRouteName: CollectionRouteName, option: null | CollectionRouteOption = null): string {
    let url = `${COLLECTION_BASE_URL}${COLLECTION_ROUTE_JSON[collectionRouteName]}`;
    return GetFullRouteFromRouteNameAndRouteOption<CollectionRouteOption>(url, option);
}