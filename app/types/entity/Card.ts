import { RequestGetInfo } from "@app/types/Request";
import { NameSlugNameEntity, TimestampableEntity, UuidStringType } from "@app/types/Entity";
import { CardAttributeEntityType, CardAttributeGetAllType } from "@app/types/entity/CardAttribute";
import { PropertyEntityType, PropertyGetAllType } from "@app/types/entity/Property";
import { CategoryEntityType, CategoryGetAllType } from "@app/types/entity/Category";
import { CardPictureEntityType, CardPictureGetAllType } from "@app/types/entity/CardPicture";
import { TypeEntityType, TypeGetAllType } from "@app/types/entity/Type";
import { SubTypeEntityType, SubTypeGetAllType } from "@app/types/entity/SubType";
import { ArchetypeEntityType, ArchetypeGetAllType } from "@app/types/entity/Archetype";
import { CardSetEntityType, CardSetGetAllType } from "@app/types/entity/CardSet";
import { SubPropertyEntityType, SubPropertyGetAllType } from "@app/types/entity/SubProperty";
import { SubCategoryEntityType, SubCategoryGetAllType } from "@app/types/entity/SubCategory";

export type CardEntityType = TimestampableEntity & NameSlugNameEntity & {
    id: number;
    uuid: UuidStringType;
    attribute: CardAttributeEntityType;
    property: PropertyEntityType;
    category: CategoryEntityType;
    pictures: CardPictureEntityType[];
    type: TypeEntityType;
    subTypes: SubTypeEntityType[];
    isEffect: string;
    description: string;
    slugDescription: string;
    pendulumDescription: string;
    monsterDescription: string;
    attackPoints: number | null;
    defensePoints: number | null;
    archetype: ArchetypeEntityType;
    idYGO: number;
    cardSets: CardSetEntityType[];
    subProperties: SubPropertyEntityType[];
    subCategory: SubCategoryEntityType;
    isPendulum: boolean | null;
};

export type CardGetAllType = NameSlugNameEntity & {
    id: number;
}

export type CardSearchType = NameSlugNameEntity & {
    id: number;
    uuid: UuidStringType;
    attribute: CardAttributeGetAllType;
    property: PropertyGetAllType;
    category: Omit<CategoryGetAllType, "subCategories">;
    picture: Pick<CardPictureGetAllType, "id" | "pictureSmallUrl">;
    type: TypeGetAllType;
    subTypes: SubTypeGetAllType[];
    isEffect: boolean;
    description: string;
    slugDescription: string;
    pendulumDescription: string;
    monsterDescription: string;
    attackPoints: number | null;
    defensePoints: number | null;
    subProperties: SubPropertyGetAllType[];
    subCategory: SubCategoryGetAllType;
    isPendulum: boolean | null;
}

export type CardGetInfoType = NameSlugNameEntity & {
    id: number;
    uuid: UuidStringType;
    attribute: CardAttributeGetAllType;
    property: PropertyGetAllType;
    category: Omit<CategoryGetAllType, "subCategories">;
    pictures: Array<Pick<CardPictureGetAllType, "id" | "pictureUrl" | "pictureSmallUrl" | "artworkUrl">>;
    type: TypeGetAllType;
    subTypes: SubTypeGetAllType[];
    isEffect: boolean;
    description: string;
    slugDescription: string;
    pendulumDescription: string;
    monsterDescription: string;
    attackPoints: number | null;
    defensePoints: number | null;
    archetype: ArchetypeGetAllType;
    cardSets: CardSetGetAllType[];
    subProperties: SubPropertyGetAllType[];
    subCategory: SubCategoryGetAllType;
    isPendulum: boolean | null;
}

export type CardSearchRequestType = {
    success: string;
    data: {
        card: CardSearchType[];
        cardAllResultCount: number;
    };
}

export type CardGetInfoRequestType = RequestGetInfo<"card", CardGetInfoType>;