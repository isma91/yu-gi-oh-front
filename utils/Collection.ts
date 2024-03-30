import { CollectionInfoType } from "@app/types/Collection";
import { SelectDeckArtworkType } from "@app/types/Deck";
import { AddApiBaseUrl, GetDefaultCardPicturePath } from "./Url";


export function TransformCardCollectionToValuesRequest(cardCollection: CollectionInfoType[], values: { [key: string]: any }): { [key in string]: any } {
    let newCardCollectionValues: { [key in string]: string } = {};
    cardCollection.forEach((cardCollectionInfo, index) => {
        console.log(cardCollectionInfo);
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