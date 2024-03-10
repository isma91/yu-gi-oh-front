import { RequestGetAll, RequestGetInfo } from "@app/types/Request";
import { NameSlugNameEntity, TimestampableEntity } from "@app/types/Entity";


export type CardAttributeEntityType = TimestampableEntity & NameSlugNameEntity & {
    id: number;
};

export type CardAttributeGetAllType = NameSlugNameEntity & {
    id: number;
}

export type CardAttributeGetAllRequestType = RequestGetAll<"cardAttribute", CardAttributeGetAllType>;

export type CardAttributeGetInfoRequestType = RequestGetInfo<"cardAttribute", CardAttributeGetAllType>;