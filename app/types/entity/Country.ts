import { RequestGetAll, RequestGetInfo } from "@app/types/Request";
import { NameSlugNameEntity, TimestampableEntity } from "@app/types/Entity";


export type CountryEntityType = TimestampableEntity & NameSlugNameEntity & {
    id: number;
};

export type CountryGetAllType = NameSlugNameEntity & {
    id: number;
    alpha2: string;
    alpha3: string;
}

export type CountryGetAllRequestType = RequestGetAll<"country", CountryGetAllType>;

export type CountryGetInfoRequestType = RequestGetInfo<"country", CountryGetAllType>;