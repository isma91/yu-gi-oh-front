import { RequestGetInfo } from "@app/types/Request";
import { NameSlugNameEntity, TimestampableEntity, UuidStringType } from "@app/types/Entity";
import { AttributeEntityType, AttributeGetAllType } from "@app/types/entity/Attribute";
import { PropertyEntityType, PropertyGetAllType } from "@app/types/entity/Property";
import { CategoryEntityType, CategoryGetAllType } from "@app/types/entity/Category";
import { CardPictureEntityType, CardPictureGetAllType } from "@app/types/entity/CardPicture";
import { TypeEntityType, TypeGetAllType } from "@app/types/entity/Type";
import { SubTypeEntityType, SubTypeGetAllType } from "@app/types/entity/SubType";
import { ArchetypeEntityType } from "@app/types/entity/Archetype";
import { CardSetEntityType } from "@app/types/entity/CardSet";
import { SubPropertyEntityType, SubPropertyGetAllType } from "@app/types/entity/SubProperty";
import { SubCategoryEntityType, SubCategoryGetAllType } from "@app/types/entity/SubCategory";

export type CardEntityType = TimestampableEntity & NameSlugNameEntity & {
    id: number;
    uuid: UuidStringType;
    attribute: AttributeEntityType;
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
    attribute: AttributeGetAllType;
    property: PropertyGetAllType;
    category: CategoryGetAllType;
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

export type CardSearchRequestType = {
    success: string;
    data: {
        card: CardSearchType[];
        cardAllResultCount: number;
    };
}
export type CardGetInfoRequestType = RequestGetInfo<"card", CardGetAllType>;