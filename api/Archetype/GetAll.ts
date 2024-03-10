import Request from "@api/Request";
import { RequestMethodType } from "@app/types/Api";
import { ArchetypeGetAllRequestType } from "@app/types/entity/Archetype";
import { GetFullRoute, ArchetypeApiRouteName } from "@routes/api/Archetype";

export default function ArchetypeGetAll(): Promise<ArchetypeGetAllRequestType> {
    return Request(GetFullRoute(ArchetypeApiRouteName.GET_ALL), RequestMethodType.GET, "Error while getting all Archetype.", null, true);
}