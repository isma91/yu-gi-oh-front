import { RequestGetAll, RequestGetInfo } from "@app/types/Request";
import { NameSlugNameEntity, TimestampableEntity } from "@app/types/Entity";
import { SubCategoryEntityType, SubCategoryGetAllType } from "@app/types/entity/SubCategory";


export type CategoryEntityType = TimestampableEntity & NameSlugNameEntity & {
    id: number;
    acceptSubCategory: boolean;
    subCategories: SubCategoryEntityType[];
};

export type CategoryGetAllType = NameSlugNameEntity & {
    id: number;
    subCategories: SubCategoryGetAllType[];
}

export type CategoryGetAllRequestType = RequestGetAll<"category", CategoryGetAllType>;

export type CategoryGetInfoRequestType = RequestGetInfo<"category", CategoryGetAllType>;