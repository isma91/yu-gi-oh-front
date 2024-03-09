import { RequestGetAll, RequestGetInfo } from "@app/types/Request";
import { NameSlugNameEntity, TimestampableEntity } from "@app/types/Entity";
import { SubCategoryEntityType } from "@app/types/entity/SubCategory";


export type CategoryEntityType = TimestampableEntity & NameSlugNameEntity & {
    id: number;
    acceptSubCategory: boolean;
    subCategories: SubCategoryEntityType[];
};

export type CategoryGetAllType = NameSlugNameEntity & {
    id: number;
}

export type CategoryGetAllRequestType = RequestGetAll<"category", CategoryGetAllType>;

export type CategoryGetInfoRequestType = RequestGetInfo<"category", CategoryGetAllType>;