import { CardSearchType } from "./entity/Card";

export type CardCollectionBasicObjectType = {
    id: number;
    name: string;
};

export type CardCollectionInfoType = {
    card: CardSearchType;
    name: string;
    nbCopie: number;
    country: CardCollectionBasicObjectType;
    rarity: CardCollectionBasicObjectType;
    set: CardCollectionBasicObjectType;
    picture: { id: number; url: string };
};