import { DeckCardFieldType, DeckCardType, SelectDeckArtworkType } from "@app/types/Deck";
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