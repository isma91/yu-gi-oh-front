import { RequestGetAll, RequestGetInfo } from "@app/types/Request";
import { NameSlugNameEntity, TimestampableEntity } from "@app/types/Entity";
import { SubPropertyEntityType } from "@app/types/entity/SubProperty";


export type SubPropertyTypeEntityType = TimestampableEntity & NameSlugNameEntity & {
    id: number;
    subProperties: SubPropertyEntityType[];
};

export type SubPropertyTypeGetAllType = NameSlugNameEntity & {
    id: number;
}

export type SubPropertyTypeGetAllRequestType = RequestGetAll<"subPropertyType", SubPropertyTypeGetAllType>;

export type SubPropertyTypeGetInfoRequestType = RequestGetInfo<"subPropertyType", SubPropertyTypeGetAllType>;