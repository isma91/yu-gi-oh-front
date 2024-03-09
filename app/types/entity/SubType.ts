import { RequestGetAll, RequestGetInfo } from "@app/types/Request";
import { NameSlugNameEntity, TimestampableEntity } from "@app/types/Entity";
import { CardEntityType } from "@app/types/entity/Card";


export type SubTypeEntityType = TimestampableEntity & NameSlugNameEntity & {
    id: number;
    cards: CardEntityType[];
};

export type SubTypeGetAllType = NameSlugNameEntity & {
    id: number;
}

export type SubTypeGetAllRequestType = RequestGetAll<"subType", SubTypeGetAllType>;

export type SubTypeGetInfoRequestType = RequestGetInfo<"subType", SubTypeGetAllType>;