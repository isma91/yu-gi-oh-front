import { RequestGetAll, RequestGetInfo } from "@app/types/Request";
import { NameSlugNameEntity, TimestampableEntity } from "@app/types/Entity";
import { CardSetEntityType } from "@app/types/entity/CardSet";


export type RarityEntityType = TimestampableEntity & NameSlugNameEntity & {
    id: number;
    cardSets: CardSetEntityType[];
};

export type RarityGetAllType = NameSlugNameEntity & {
    id: number;
}

export type RarityGetAllRequestType = RequestGetAll<"rarity", RarityGetAllType>;

export type RarityGetInfoRequestType = RequestGetInfo<"rarity", RarityGetAllType>;