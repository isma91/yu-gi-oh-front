export enum CollectionRouteName {
    LIST = "list",
    CREATE = "create",
}

export const COLLECTION_ROUTE_JSON = {
    [CollectionRouteName.LIST]: "/list",
    [CollectionRouteName.CREATE]: "/create",
};

export const COLLECTION_BASE_URL = "/collection";