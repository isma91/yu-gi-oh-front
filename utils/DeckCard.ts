import { DeckCardFieldType, DeckCardNumberPerFieldTypeType, DeckCardType, SelectDeckArtworkType } from "@app/types/Deck";
import { GetCardPictureUrl } from "@utils/SearchCard";

export function GetSelectDeckArtworkFromDeckCard(deckCard: DeckCardType): SelectDeckArtworkType[] {
    let newDeckCardUniqueArray: SelectDeckArtworkType[] = [];
    let newDeckCardUniqueJson: { [key in number]: { url: string; name: string } } = {};
    const cardFieldTypeArray = Object.values(DeckCardFieldType);
    cardFieldTypeArray.forEach((cardFieldType) => {
        deckCard[cardFieldType].forEach((cardInfo) => {
            const { id, name } = cardInfo;
            newDeckCardUniqueJson[id] = { url: GetCardPictureUrl(cardInfo), name };
        });
    });
    Object.keys(newDeckCardUniqueJson).forEach((idString) => {
        const id = parseInt(idString, 10);
        const { url, name } = newDeckCardUniqueJson[id];
        newDeckCardUniqueArray.push({ id: id, url: url, name: name });
    });
    return newDeckCardUniqueArray;
};

export function TransformDeckCardToValueRequest(deckCard: DeckCardType, values: {[key: string]: any}): {[key in string]: any} {
    const deckCardFieldTypeArray = Object.values(DeckCardFieldType);
    let deckCardUniqueJson: { [key in DeckCardFieldType]: { [key in number]: number } } = {
        [DeckCardFieldType.MAIN_DECK]: {},
        [DeckCardFieldType.EXTRA_DECK]: {},
        [DeckCardFieldType.SIDE_DECK]: {},
    };
    deckCardFieldTypeArray.forEach((cardFieldType) => {
        deckCard[cardFieldType].forEach((cardInfo) => {
            const { id: cardInfoId } = cardInfo;
            if (deckCardUniqueJson[cardFieldType][cardInfoId] === undefined) {
                deckCardUniqueJson[cardFieldType][cardInfoId] = 1;
            } else {
                deckCardUniqueJson[cardFieldType][cardInfoId] = deckCardUniqueJson[cardFieldType][cardInfoId] + 1;
            }
        });
    });
    let newDeckCardValues: { [key in string]: string } = {};
    deckCardFieldTypeArray.forEach((cardFieldType) => {
        Object.keys(deckCardUniqueJson[cardFieldType]).forEach((cardInfoIdString, index) => {
            const cardInfoId = parseInt(cardInfoIdString, 10);
            const nbCopie = deckCardUniqueJson[cardFieldType][cardInfoId];
            const newDeckCardValuesBaseKey = `deck-card[${cardFieldType}][${index}]`;
            newDeckCardValues[`${newDeckCardValuesBaseKey}[id]`] = cardInfoId.toString(10);
            newDeckCardValues[`${newDeckCardValuesBaseKey}[nbCopie]`] = nbCopie.toString(10);
        });
    });
    return { ...values, ...newDeckCardValues };
}

export function FindAllDeckCardWarning(deckCardNumberPerFieldType: DeckCardNumberPerFieldTypeType): string[] {
    const nbCardMinMainDeck = parseInt(process.env["NEXT_PUBLIC_NB_MIN_CARD_MAIN_DECK"] as string, 10);
    const nbCardMaxMainDeck = parseInt(process.env["NEXT_PUBLIC_NB_MAX_CARD_MAIN_DECK"] as string, 10);
    const nbCardMaxExtraDeck = parseInt(process.env["NEXT_PUBLIC_NB_MAX_CARD_EXTRA_DECK"] as string, 10);
    const nbCardMaxSideDeck = parseInt(process.env["NEXT_PUBLIC_NB_MAX_CARD_SIDE_DECK"] as string, 10);
    const deckCardMainDeckNumber = deckCardNumberPerFieldType[DeckCardFieldType.MAIN_DECK];
    const deckCardExtraDeckNumber = deckCardNumberPerFieldType[DeckCardFieldType.EXTRA_DECK];
    const deckCardSideDeckNumber = deckCardNumberPerFieldType[DeckCardFieldType.SIDE_DECK];
    let deckWarningArray = [];
    if (deckCardMainDeckNumber > nbCardMaxMainDeck) {
        deckWarningArray.push(`The ${DeckCardFieldType.MAIN_DECK} have more than ${nbCardMaxMainDeck} cards !!`);
    } else if (deckCardMainDeckNumber < nbCardMinMainDeck) {
        deckWarningArray.push(`The ${DeckCardFieldType.MAIN_DECK} have less than ${nbCardMinMainDeck} cards !!`);
    } else if (deckCardExtraDeckNumber > nbCardMaxExtraDeck) {
        deckWarningArray.push(`The ${DeckCardFieldType.EXTRA_DECK} have more than ${nbCardMaxExtraDeck} cards !!`);
    } else if (deckCardSideDeckNumber > nbCardMaxSideDeck) {
        deckWarningArray.push(`The ${DeckCardFieldType.SIDE_DECK} have more than ${nbCardMaxSideDeck} cards !!`);
    }
    return deckWarningArray;
}