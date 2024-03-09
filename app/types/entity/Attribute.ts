import { RequestGetAll, RequestGetInfo } from "@app/types/Request";
import { NameSlugNameEntity, TimestampableEntity } from "@app/types/Entity";


export type AttributeEntityType = TimestampableEntity & NameSlugNameEntity & {
    id: number;
};

export type AttributeGetAllType = NameSlugNameEntity & {
    id: number;
}

export type AttributeGetAllRequestType = RequestGetAll<"attribute", AttributeGetAllType>;

export type AttributeGetInfoRequestType = RequestGetInfo<"attribute", AttributeGetAllType>;