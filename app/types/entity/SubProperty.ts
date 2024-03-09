import { RequestGetAll, RequestGetInfo } from "@app/types/Request";
import { NameSlugNameEntity, TimestampableEntity } from "@app/types/Entity";
import { SubPropertyTypeEntityType, SubPropertyTypeGetAllType } from "@app/types/entity/SubPropertyType";
import { CardEntityType } from "@app/types/entity/Card";


export type SubPropertyEntityType = TimestampableEntity & NameSlugNameEntity & {
    id: number;
    subPropertyType: SubPropertyTypeEntityType;
    cards: CardEntityType[];
};

export type SubPropertyGetAllType = NameSlugNameEntity & {
    id: number;
    subPropertyType: SubPropertyTypeGetAllType;

}

export type SubPropertyGetAllRequestType = RequestGetAll<"SubProperty", SubPropertyGetAllType>;

export type SubPropertyGetInfoRequestType = RequestGetInfo<"SubProperty", SubPropertyGetAllType>;