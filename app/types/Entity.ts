import { CardEntityType, CardSearchType } from "@app/types/entity/Card";
import { DeckEntityType } from "@app/types/entity/Deck";
import { CardPictureGetAllType } from "@app/types/entity/CardPicture";

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

export type CardDeckGetInfoType = NameSlugNameEntity & {
    id: number;
    nbCopie: number;
    cards: Array<CardSearchType & {
        pictures: Array<Omit<CardPictureGetAllType, "picture" | 'artwork' | "pictureSmall" | "idYGO">>
    }>,
}