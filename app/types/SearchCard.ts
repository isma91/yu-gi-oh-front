import { CardSearchType } from "@app/types/entity/Card";

export type SearchCardCardInfoJsonKeyType =
    | "categoryWithSubCategory"
    | "attribute"
    | "type"
    | "atkDef"
    | "propertyWithPropertyType"
    | "subPropertyWithPropertyType";

export type SearchCardCardInfoJsonType = {
    [key in SearchCardCardInfoJsonKeyType]: string;
};

export type CardInfoToDisplayType = {
    cardInfo: CardSearchType;
    popoverId: string;
};