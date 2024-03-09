import { RequestGetAll, RequestGetInfo } from "@app/types/Request";
import { NameSlugNameEntity, TimestampableEntity } from "@app/types/Entity";


export type TypeEntityType = TimestampableEntity & NameSlugNameEntity & {
    id: number;
};

export type TypeGetAllType = NameSlugNameEntity & {
    id: number;
}

export type TypeGetAllRequestType = RequestGetAll<"Type", TypeGetAllType>;

export type TypeGetInfoRequestType = RequestGetInfo<"Type", TypeGetAllType>;