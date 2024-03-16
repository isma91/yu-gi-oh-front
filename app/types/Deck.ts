import { CardSearchType } from "@app/types/entity/Card";

export type SelectDeckArtowrkType = {
    id: number;
    url: string;
    name: string;
};

export enum DeckCardFieldType {
    MAIN_DECK = "main-deck",
    EXTRA_DECK = "extra-deck",
    SIDE_DECK = "side-deck",
}

export type DeckCardType = {
    [key in DeckCardFieldType]: CardSearchType[];
};