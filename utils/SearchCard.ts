import { SearchCardCardInfoJsonType } from "@app/types/SearchCard";
import { CardSearchType } from "@app/types/entity/Card";
import { AddApiBaseUrl, GetDefaultCardPicturePath } from "@utils/Url";
import { LimitText } from "@utils/String";

export function GetCardPictureUrl(cardInfo: CardSearchType): string  {
    let pictureUrl = null;
    if (cardInfo.picture.pictureSmallUrl !== null) {
        pictureUrl = AddApiBaseUrl(cardInfo.picture.pictureSmallUrl);
    } else {
        pictureUrl = GetDefaultCardPicturePath();
    }
    return pictureUrl;
};

export function GetCardCategoryWithSubCategory(cardInfo: CardSearchType): string {
    const { category: cardInfoCategory, isEffect, subCategory: cardInfoSubCategory, subTypes: cardInfoSubTypeArray } = cardInfo;
    if (cardInfoCategory === null) {
        return "";
    }
    const isMonster = cardInfoCategory.slugName === "monster";
    let cardCategoryWithSubCategory = cardInfoCategory.name;
    if (cardInfoSubCategory !== null) {
        cardCategoryWithSubCategory += `: ${cardInfoSubCategory.name}`;
    }
    if (isMonster === true) {
        if (cardInfoSubCategory === null) {
            if (isEffect !== null) {
                const stringIsEffect = isEffect === true ? "Effect" : "Normal";
                cardCategoryWithSubCategory += `: ${stringIsEffect}`;
            }
        }
        if (cardInfo.isPendulum === true) {
            cardCategoryWithSubCategory += ` / Pendulum`;
        }
    }
    if (cardInfoSubTypeArray.length !== 0) {
        cardInfoSubTypeArray.forEach((cardInfoSubType) => {
            cardCategoryWithSubCategory += ` / ${cardInfoSubType.name}`;
        });
    }
    return cardCategoryWithSubCategory;
};

export function GetCardType(cardInfo: CardSearchType): string {
    const { type: cardInfoType } = cardInfo;
    if (cardInfoType === null) {
        return "";
    }
    return `Type: ${cardInfoType.name}`;
};

export function GetCardAtkDef(cardInfo: CardSearchType): string {
    const { attackPoints: cardInfoAtk, defensePoints: cardInfoDef } = cardInfo;
    if (cardInfoAtk === null && cardInfoDef === null) {
        return "";
    }
    let stringCardAtkDef = "";
    if (cardInfoAtk !== null) {
        stringCardAtkDef = `Atk: ${cardInfoAtk}`;
    }
    if (cardInfoDef !== null) {
        stringCardAtkDef += ` Def: ${cardInfoDef}`;
    }
    return stringCardAtkDef;
};

export function GetCardDescription(cardInfo: CardSearchType, limitText: number): string {
    const { description: cardInfoDescription, isPendulum, monsterDescription: cardInfoMonsterDescription } = cardInfo;
    let cardDescription = isPendulum === true ? cardInfoMonsterDescription : cardInfoDescription;
    return LimitText(cardDescription, limitText);
};

export function GetCardAttribute(cardInfo: CardSearchType): string {
    const { attribute: cardInfoAttribute } = cardInfo;
    return cardInfoAttribute !== null ? `Attribute: ${cardInfoAttribute.name}` : "";
};

export function GetPropertyWithPropertyType(cardInfo: CardSearchType): string {
    const { property: cardInfoProperty } = cardInfo;
    let cardInfoPropertyWithPopertyType = "";
    if (cardInfoProperty !== null) {
        const { propertyType: cardInfoPopertyType } = cardInfoProperty;
        if (cardInfoPopertyType !== null) {
            cardInfoPropertyWithPopertyType = `${cardInfoPopertyType.name}: ${cardInfoProperty.name}`;
        }
    }
    return cardInfoPropertyWithPopertyType;
};

export function GetSubProperty(cardInfo: CardSearchType): string {
    const { subProperties: cardInfoSubPropertyArray } = cardInfo;
    if (cardInfoSubPropertyArray === null || cardInfoSubPropertyArray.length === 0) {
        return "";
    }
    let cardInfoSubProperty = "";
    let cardInfoSubPropertyType = "";
    cardInfoSubPropertyArray.forEach((subProperty) => {
        if (cardInfoSubPropertyType === "" && subProperty.subPropertyType !== null) {
            cardInfoSubPropertyType = `${cardInfoSubPropertyArray[0].subPropertyType.name}:`;
        }
        cardInfoSubProperty += ` ${subProperty.name}, `;
    });
    cardInfoSubProperty = cardInfoSubProperty.slice(0, -2);
    return `${cardInfoSubPropertyType}${cardInfoSubProperty}`;
};

export function GetCardInfoStringJson(cardInfo: CardSearchType): SearchCardCardInfoJsonType {
    return {
        categoryWithSubCategory: GetCardCategoryWithSubCategory(cardInfo),
        attribute: GetCardAttribute(cardInfo),
        type: GetCardType(cardInfo),
        atkDef: GetCardAtkDef(cardInfo),
        propertyWithPropertyType: GetPropertyWithPropertyType(cardInfo),
        subPropertyWithPropertyType: GetSubProperty(cardInfo),
    };
};