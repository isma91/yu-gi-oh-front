import { CollectionInfoType } from "@app/types/Collection";
import { SelectDeckArtworkType } from "@app/types/Deck";
import { AddApiBaseUrl, GetDefaultCardPicturePath } from "./Url";
import { CollectionGetInfoType } from "@app/types/entity/Collection";
import { CardSearchType } from "@app/types/entity/Card";


export function TransformCardCollectionToValuesRequest(cardCollection: CollectionInfoType[], values: { [key: string]: any }): { [key in string]: any } {
    let newCardCollectionValues: { [key in string]: string } = {};
    cardCollection.forEach((cardCollectionInfo, index) => {
        const { nbCopie, picture, country, set, rarity } = cardCollectionInfo;
        const cardCollectionBasicInfoArray = [
            { name: "picture", value: picture.id },
            { name: "country", value: country.id },
            { name: "set", value: set.id },
            { name: "rarity", value: rarity.id },
            { name: "card", value: cardCollectionInfo.card.id }
        ];
        const cardCollectionBaseKey = `card-collection[${index}]`;
        newCardCollectionValues[`${cardCollectionBaseKey}[nbCopie]`] = nbCopie.toString(10);
        cardCollectionBasicInfoArray.forEach((basicInfo) => {
            const { name, value } = basicInfo;
            newCardCollectionValues[`${cardCollectionBaseKey}[${name}]`] = value.toString(10);
        })
    });
    return { ...values, ...newCardCollectionValues };
}

export function GetSelectCollectionArtworkFromCollectionInfo(cardCollection: CollectionInfoType[]): SelectDeckArtworkType[] {
    let newSelectCollectionArtworkJson: { [key in number]: SelectDeckArtworkType } = {};
        for (let i = 0; i < cardCollection.length; i++) {
            const { name, pictures } = cardCollection[i].card;
            for (let j = 0; j < pictures.length; j++) {
                const { id, artworkUrl } = pictures[j];
                let url: string;
                if (artworkUrl !== null) {
                    url = AddApiBaseUrl(artworkUrl);
                } else {
                    url = GetDefaultCardPicturePath();
                }
                if (newSelectCollectionArtworkJson[id] !== undefined) {
                    continue;
                }
                newSelectCollectionArtworkJson[id] = { id: id, name: `${name} [n°${j + 1}]`, url: url };
            }
        }
    return Object.values(newSelectCollectionArtworkJson);
}

export function TransformCollectionInfoToCardCollectionInfo(collectionInfo: CollectionGetInfoType) {
    let newArray: CollectionInfoType[] = [];
    collectionInfo.cardCardCollections.forEach((cardCardCollectionInfo) => {
        const { card, cardSet, rarity, picture } = cardCardCollectionInfo;
        let newPicture = { id: 0, url: GetDefaultCardPicturePath() };
        let newCardPicture: CardSearchType["picture"] = { id: 0, pictureSmallUrl: null };
        if (picture !== null) {
            if (picture.artworkUrl !== null) {
                newPicture = { id: picture.id, url: AddApiBaseUrl(picture.artworkUrl) };
            }
            newCardPicture = { ...picture };
        }
        let newSet: CollectionInfoType["set"];
        if (cardSet !== null) {
            newSet = { ...cardSet };
        } else {
            newSet = { id: 0, name: "Unknown" };
        }
        let newRarity: CollectionInfoType["rarity"];
        if (rarity !== null) {
            newRarity = { ...rarity };
        } else {
            newRarity = { id: 0, name: "Unknown" };
        }
        newArray.push({
            ...cardCardCollectionInfo,
            set: newSet,
            rarity: newRarity,
            card: { ...card, picture: newCardPicture },
            name: card.name,
            picture: newPicture
        });
    });
    return newArray;
}