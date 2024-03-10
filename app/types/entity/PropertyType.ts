import { RequestGetAll, RequestGetInfo } from "@app/types/Request";
import { NameSlugNameEntity, TimestampableEntity } from "@app/types/Entity";
import { PropertyEntityType, PropertyGetAllType } from "@app/types/entity/Property";


export type PropertyTypeEntityType = TimestampableEntity & NameSlugNameEntity & {
    id: number;
    properties: PropertyEntityType[];
};

export type PropertyTypeGetAllType = NameSlugNameEntity & {
    id: number;
    properties: Array<Omit<PropertyGetAllType, "propertyType">>;
}

export type PropertyTypeGetAllRequestType = RequestGetAll<"propertyType", PropertyTypeGetAllType>;

export type PropertyTypeGetInfoRequestType = RequestGetInfo<"propertyType", PropertyTypeGetAllType>;