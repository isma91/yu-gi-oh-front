import { RequestGetAll, RequestGetInfo } from "@app/types/Request";
import { DateStringType, NameSlugNameEntity, TimestampableEntity } from "@app/types/Entity";
import { CardSetEntityType, CardSetGetAllType } from "@app/types/entity/CardSet";
import { CardSearchType } from "./Card";


export type SetEntityType = TimestampableEntity & NameSlugNameEntity & {
    id: number;
    code: string;
    nbCard: number | null;
    cardSets: CardSetEntityType[];
};

export type SetGetAllType = NameSlugNameEntity & {
    id: number;
    code: string | null;
    releaseDate: DateStringType | null;
}

export type SetGetInfoType = SetSearchType & {
    cardSets: Array<Omit<CardSetGetAllType, "sets"> & {
        card: CardSearchType
    }>
}

export type SetSearchType = SetGetAllType & {
    nbCard: number;
}

export type SetSearchRequestType = {
    success: string;
    data: {
        set: SetSearchType[];
        setAllResultCount: number;
    };
}

export type SetGetAllRequestType = RequestGetAll<"set", SetGetAllType>;

export type SetGetInfoRequestType = RequestGetInfo<"set", SetGetInfoType>;