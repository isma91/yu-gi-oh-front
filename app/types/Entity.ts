import { CardEntityType, CardSearchType } from "@app/types/entity/Card";
import { DeckEntityType } from "@app/types/entity/Deck";

export interface TimestampableEntity {
    createdAt: Date | DateStringType;
    updatedAt: Date | DateStringType;
}

export interface NameSlugNameEntity {
    name: string;
    slugName: string;
}

export type DateStringType = string;

export type UuidStringType = string;

export type CardDeckEntityType = TimestampableEntity & NameSlugNameEntity & {
    id: number;
    cards: CardEntityType[];
    nbCopie: number;
    deck: DeckEntityType;
};

export type CardDeckeGetInfoType = NameSlugNameEntity & {
    id: number;
    nbCopie: number;
    cards: CardSearchType[],
}