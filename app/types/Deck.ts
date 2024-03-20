import { CardSearchType } from "@app/types/entity/Card";
import { CardMainDeckGetInfoType } from "@app/types/entity/CardMainDeck";
import { CardExtraDeckGetInfoType } from "@app/types/entity/CardExtraDeck";
import { CardSideDeckGetInfoType } from "@app/types/entity/CardSideDeck";

export type SelectDeckArtworkType = {
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

export type DeckCardOpenType = {
    [key in DeckCardFieldType]: boolean;
};

export type DeckInfoType = {
    [DeckCardFieldType.MAIN_DECK]: CardMainDeckGetInfoType[];
    [DeckCardFieldType.EXTRA_DECK]: CardExtraDeckGetInfoType[];
    [DeckCardFieldType.SIDE_DECK]: CardSideDeckGetInfoType[];
}