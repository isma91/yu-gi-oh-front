import { CardSearchType } from "@app/types/entity/Card";

export type CollectionBasicObjectType = {
    id: number;
    name: string;
};

export type CollectionInfoType = {
    card: CardSearchType;
    name: string;
    nbCopie: number;
    country: CollectionBasicObjectType;
    rarity: CollectionBasicObjectType;
    set: CollectionBasicObjectType;
    picture: { id: number; url: string };
};