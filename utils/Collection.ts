import { CardCollectionInfoType } from "@app/types/Collection";


export function TransformCardCollectionToValuesRequest(cardCollection: CardCollectionInfoType[], values: { [key: string]: any }): { [key in string]: any } {
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