import { RequestGetAll, RequestGetInfo } from "@app/types/Request";
import { DateStringType, NameSlugNameEntity, TimestampableEntity } from "@app/types/Entity";
import { CardSetEntityType } from "@app/types/entity/CardSet";


export type SetEntityType = TimestampableEntity & NameSlugNameEntity & {
    id: number;
    code: string;
    nbCard: number | null;
    cardSets: CardSetEntityType[];
};

export type SetGetAllType = NameSlugNameEntity & {
    id: number;
    code: string;
    releaseDate: DateStringType | null;
}

export type SetGetAllRequestType = RequestGetAll<"set", SetGetAllType>;

export type SetGetInfoRequestType = RequestGetInfo<"set", SetGetAllType>;