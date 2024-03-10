import { RequestGetAll, RequestGetInfo } from "@app/types/Request";
import { NameSlugNameEntity, TimestampableEntity } from "@app/types/Entity";


export type SubCategoryEntityType = TimestampableEntity & NameSlugNameEntity & {
    id: number;
};

export type SubCategoryGetAllType = NameSlugNameEntity & {
    id: number;
}

export type SubCategoryGetAllRequestType = RequestGetAll<"subCategory", SubCategoryGetAllType>;

export type SubCategoryGetInfoRequestType = RequestGetInfo<"subCategory", SubCategoryGetAllType>;