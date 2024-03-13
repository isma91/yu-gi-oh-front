import { RequestGetAll, RequestGetInfo } from "@app/types/Request";
import { NameSlugNameEntity, TimestampableEntity } from "@app/types/Entity";
import { PropertyTypeEntityType, PropertyTypeGetAllType } from "@app/types/entity/PropertyType";


export type PropertyEntityType = TimestampableEntity & NameSlugNameEntity & {
    id: number;
    propertyType: PropertyTypeEntityType;
};

export type PropertyGetAllType = NameSlugNameEntity & {
    id: number;
    propertyType: Omit<PropertyTypeGetAllType, "properties">;
}

export type PropertyGetAllRequestType = RequestGetAll<"property", PropertyGetAllType>;

export type PropertyGetInfoRequestType = RequestGetInfo<"property", PropertyGetAllType>;