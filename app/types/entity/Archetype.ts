import { RequestGetAll, RequestGetInfo } from "@app/types/Request";
import { NameSlugNameEntity, TimestampableEntity } from "@app/types/Entity";


export type ArchetypeEntityType = TimestampableEntity & NameSlugNameEntity & {
    id: number;
};

export type ArchetypeGetAllType = NameSlugNameEntity & {
    id: number;
}

export type ArchetypeGetAllRequestType = RequestGetAll<"Archetype", ArchetypeGetAllType>;

export type ArchetypeGetInfoRequestType = RequestGetInfo<"Archetype", ArchetypeGetAllType>;