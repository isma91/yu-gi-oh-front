export enum ArchetypeApiRouteName {
    GET_ALL = "get-all",
}

const ARCHETYPE_API_ROUTE_JSON = {
    [ArchetypeApiRouteName.GET_ALL]: "/all",
};

export const ARCHETYPE_API_BASE_URL = "/archetype";

export function GetFullRoute(name: ArchetypeApiRouteName): string {
    return `${ARCHETYPE_API_BASE_URL}${ARCHETYPE_API_ROUTE_JSON[name]}`;
}