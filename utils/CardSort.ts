import { CardSearchType } from "@app/types/entity/Card";
import { ArrayIncludes } from "@utils/Array";
import { GetIndexArray } from "@utils/Parsing";

type DeckCardMonsterSortKeyType = "normal" | "effect" | "ritual" | "fusion" | "synchro" | "xyz" | "link";

type DeckCardMonsterSortType = {
    [key in DeckCardMonsterSortKeyType]: CardSearchType[];
};

type CustomSortType = "custom" | "asc" | "desc";

type AttributeType = "divine" | "light" | "dark" | "earth" | "fire" | "water" | "wind";

type SpellType = "normal" | "ritual" | "quick" | "continuous" | "equip" | "field";

type DeckCardSpellSortType = {
    [key in SpellType]: CardSearchType[];
};

type TrapType = "normal" | "continuous" | "counter"

type DeckCardTrapSortType = {
    [key in TrapType]: CardSearchType[];
};

function getMonsterSubCategorySort(cardInfo: CardSearchType, cardMonsterSortTypeKeyArray: DeckCardMonsterSortKeyType[]): DeckCardMonsterSortKeyType | null {
    let monsterSortSubCategory: DeckCardMonsterSortKeyType | null = null;
    const { subCategory, isEffect } = cardInfo;
    if (subCategory === null) {
        if (isEffect === true) {
            monsterSortSubCategory = "effect" as DeckCardMonsterSortKeyType;
        } else if (isEffect === false) {
            monsterSortSubCategory = "normal" as DeckCardMonsterSortKeyType;
        }
    } else {
        const subCategorySlugName: string | DeckCardMonsterSortKeyType = subCategory.slugName;
        const subCategoryIncludes = ArrayIncludes<DeckCardMonsterSortKeyType, string>(cardMonsterSortTypeKeyArray, subCategory.slugName);
        if (subCategoryIncludes === true) {
            monsterSortSubCategory = subCategorySlugName as DeckCardMonsterSortKeyType;
        }
    }
    return monsterSortSubCategory;
}

export function SortCheckEl(aEl: any, bEl: any): number | null {
    if (aEl === null && bEl === null) {
        return 0;
    }
    if (aEl === null) {
        return 1;
    }
    if (bEl === null) {
        return -1;
    }
    return null;
}

function SortFromLevel(a: CardSearchType, b: CardSearchType, asc: boolean = true): number {
    const { property: aProperty } = a;
    const { property: bProperty } = b;
    let aLevel: number | null = null;
    let bLevel: number | null = null;
    if (aProperty !== null) {
        aLevel = parseInt(aProperty.name, 10);
    }
    if (bProperty !== null) {
        bLevel = parseInt(bProperty.name, 10);
    }
    const checkEl = SortCheckEl(aProperty, bProperty);
    if (checkEl !== null) {
        return checkEl;
    }
    aLevel = aLevel as number;
    bLevel = bLevel as number;
    if (asc === true) {
        return aLevel < bLevel ? -1 : 1;
    }
    return aLevel < bLevel ? 1 : -1;
}

function SortByAttribute(a: CardSearchType, b: CardSearchType, sortType: CustomSortType = "custom"): number {
    const attributeSortJson: {[key in AttributeType] : number} = {
        divine: 0,
        light: 1,
        dark: 2,
        earth: 3,
        fire: 4,
        water: 5,
        wind: 6,
    };
    const { attribute: aAttribute } = a;
    const { attribute: bAttribute } = b;
    let aAttributeValue:  AttributeType | null = null;
    let bAttributeValue: AttributeType | null = null;
    if (aAttribute !== null) {
        aAttributeValue = aAttribute.slugName as AttributeType;
    }
    if (bAttribute !== null) {
        bAttributeValue = bAttribute.slugName as AttributeType;
    }
    const checkEl = SortCheckEl(aAttribute, bAttribute);
    if (checkEl !== null) {
        return checkEl;
    }
    aAttributeValue = aAttributeValue as AttributeType;
    bAttributeValue = bAttributeValue as AttributeType;
    if (sortType === "custom") {
        const aAttributeCustomSortValue: number = attributeSortJson[aAttributeValue];
        const bAttributeCustomSortValue: number = attributeSortJson[bAttributeValue];
        return aAttributeCustomSortValue < bAttributeCustomSortValue ? -1 : 1;
    } else if (sortType === "asc") {
        return aAttributeValue.localeCompare(bAttributeValue);
    } else {
        return bAttributeValue.localeCompare(aAttributeValue);
    }
}

function SortByMonsterType(a: CardSearchType, b: CardSearchType, asc: boolean = true): number {
    const { type: aType } = a;
    const { type: bType } = b;
    let aTypeValue: string | null = null;
    let bTypeValue: string | null = null;
    if (aType !== null) {
        aTypeValue = aType.slugName;
    }
    if (bType !== null) {
        bTypeValue = bType.slugName;
    }
    const checkEl = SortCheckEl(aTypeValue, bTypeValue);
    if (checkEl !== null) {
        return checkEl;
    }
    aTypeValue = aTypeValue as string;
    bTypeValue = bTypeValue as string;
    if (asc === true) {
        return aTypeValue.localeCompare(bTypeValue);
    } else {
        return bTypeValue.localeCompare(aTypeValue);
    }
}

function SortByAtk(a: CardSearchType, b: CardSearchType, asc: boolean = true): number {
    const { attackPoints: aAttackPoints } = a;
    const { attackPoints: bAttackPoints } = b;
    let aAtk: number | null = null;
    let bAtk: number | null = null;
    if (aAttackPoints !== null) {
        aAtk = aAttackPoints;
    }
    if (bAttackPoints !== null) {
        bAtk = bAttackPoints;
    }
    const checkEl = SortCheckEl(aAtk, bAtk);
    if (checkEl !== null) {
        return checkEl;
    }
    aAtk = aAtk as number;
    bAtk = bAtk as number;
    if (asc === true) {
        return aAtk < bAtk ? -1 : 1;
    }
    return aAtk < bAtk ? 1 : -1;

}

function SortByDef(a: CardSearchType, b: CardSearchType, asc: boolean = true): number {
    const { defensePoints: aDefensePoints } = a;
    const { defensePoints: bDefensePoints } = b;
    let aDef: number | null = null;
    let bDef: number | null = null;
    if (aDefensePoints !== null) {
        aDef = aDefensePoints;
    }
    if (bDefensePoints !== null) {
        bDef = bDefensePoints;
    }
    const checkEl = SortCheckEl(aDef, bDef);
    if (checkEl !== null) {
        return checkEl;
    }
    aDef = aDef as number;
    bDef = bDef as number;
    if (asc === true) {
        return aDef < bDef ? -1 : 1;
    }
    return aDef < bDef ? 1 : -1;

}

function SortByName(a: CardSearchType, b: CardSearchType, asc: boolean = true): number {
    const { name: aName } = a;
    const { name: bName } = b;
    let aNameValue: string | null = null;
    let bNameValue: string | null = null;
    if (aName !== null) {
        aNameValue = aName;
    }
    if (bName !== null) {
        bNameValue = bName;
    }
    const checkEl = SortCheckEl(aNameValue, bNameValue);
    if (checkEl !== null) {
        return checkEl;
    }
    aNameValue = aNameValue as string;
    bNameValue = bNameValue as string;
    if (asc === true) {
        return aNameValue.localeCompare(bNameValue);
    }
    return bNameValue.localeCompare(aNameValue);
}

function SortById(a: CardSearchType, b: CardSearchType): number {
    const { id: aid } = a;
    const { id: bid } = b;
    if (aid === bid) {
        return 0;
    }
    return aid < bid ? -1 : 1;
}

function SortBySpellTrapType<T extends string>(sortJson: { [key in T]: number }, a: CardSearchType, b: CardSearchType, sortType: CustomSortType = "custom") {
    const { subCategory: aSubCategory } = a;
    const { subCategory: bSubCategory } = b;
    let aSubCategoryValue: T | null = null;
    let bSubCategoryValue: T | null = null;
    if (aSubCategory !== null) {
        aSubCategoryValue = aSubCategory.slugName as T;
    }
    if (bSubCategory !== null) {
        bSubCategoryValue = bSubCategory.slugName as T;
    }
    const checkEl = SortCheckEl(aSubCategoryValue, bSubCategoryValue);
    if (checkEl !== null) {
        return checkEl;
    }
    aSubCategoryValue = aSubCategoryValue as T;
    bSubCategoryValue = bSubCategoryValue as T;
    if (sortType === "custom") {
        const aSubCategoryCustomSortValue: number = sortJson[aSubCategoryValue];
        const bSubCategoryCustomSortValue: number = sortJson[bSubCategoryValue];
        return aSubCategoryCustomSortValue < bSubCategoryCustomSortValue ? -1 : 1;
    } else if (sortType === "asc") {
        return aSubCategoryValue.localeCompare(bSubCategoryValue);
    } else {
        return bSubCategoryValue.localeCompare(aSubCategoryValue);
    }
}

function regroupEl(cardInfoArray: CardSearchType[]) {
    let newCardInfoArray: CardSearchType[] = [];
    let regroupedCardInfoUniqueArray: Array<{ id: number, indexBegin: number, nbCopie: number, cardInfo: CardSearchType}> = [];
    cardInfoArray.forEach((cardInfo, indexCardInfo) => {
        const { id: cardInfoId } = cardInfo;
        const indexRegroupedCardInfoArray = GetIndexArray(regroupedCardInfoUniqueArray, "id", cardInfoId);
        if (indexRegroupedCardInfoArray === null) {
            regroupedCardInfoUniqueArray.push({ id: cardInfoId, indexBegin: indexCardInfo, nbCopie: 1, cardInfo: cardInfo });
        } else {
            let newEl = { ...regroupedCardInfoUniqueArray[indexRegroupedCardInfoArray] };
            newEl.nbCopie = newEl.nbCopie + 1;
            regroupedCardInfoUniqueArray[indexRegroupedCardInfoArray] = newEl;
        }
    });
    let newIndexBegin: number = 0;
    regroupedCardInfoUniqueArray.forEach((regroupedInfo) => {
        const { nbCopie, indexBegin, cardInfo } = regroupedInfo;
        if (newIndexBegin === null) {
            newIndexBegin = indexBegin;
        }
        for (let i = 0; i < nbCopie; i++) {
            const index = newIndexBegin + i;
            newCardInfoArray[index] = cardInfo;
        }
        newIndexBegin += nbCopie;
    })
    return newCardInfoArray;
}

export function Sort(cardInfoArray: CardSearchType[]) {    
    let newCardInfoArray: CardSearchType[] = [];
    let cardMonsterSort: DeckCardMonsterSortType = {
        normal: [],
        effect: [],
        ritual: [],
        fusion: [],
        synchro: [],
        xyz: [],
        link: [],
    };
    let cardSpellArray: CardSearchType[] = [];
    const spellSortJson: { [key in SpellType]: number } = {
        normal: 0,
        ritual: 1,
        quick: 2,
        continuous: 3,
        equip: 4,
        field: 5,
    };
    let cardTrapArray: CardSearchType[] = [];
    const trapSortJson: {[key in TrapType] : number} = {
        normal: 0,
        continuous: 1,
        counter: 2,
    };
    const cardMonsterSortTypeKeyArray = Object.keys(cardMonsterSort) as DeckCardMonsterSortKeyType[];
    cardInfoArray.forEach((cardInfo) => {
        if (cardInfo.category !== null) {
            const cardInfoCategory = cardInfo.category.slugName;
            if (cardInfoCategory === "monster") {
                const monsterSubCategorySort = getMonsterSubCategorySort(cardInfo, cardMonsterSortTypeKeyArray);
                if (monsterSubCategorySort !== null) {
                    cardMonsterSort[monsterSubCategorySort].push(cardInfo);
                }
            } else if (cardInfoCategory === "spell") {
                cardSpellArray.push(cardInfo);
            } else if (cardInfoCategory === "trap") {
                cardTrapArray.push(cardInfo);
            }
        }
    });

    cardMonsterSortTypeKeyArray.forEach((cardMonsterSortType) => {
        let cardMonsterSorted = cardMonsterSort[cardMonsterSortType].sort((a, b) => {
            return SortFromLevel(a, b, false) ||
                SortByAttribute(a, b) ||
                SortByMonsterType(a, b) ||
                SortByAtk(a, b, false) ||
                SortByDef(a, b, false) ||
                SortByName(a, b);
        });
        cardMonsterSorted = regroupEl(cardMonsterSorted);
        newCardInfoArray = newCardInfoArray.concat(cardMonsterSorted);
    });
    let cardSpellSorted = cardSpellArray.sort((a, b) => SortBySpellTrapType<SpellType>(spellSortJson, a, b));
    cardSpellSorted = cardSpellSorted.sort(SortByName);
    cardSpellSorted = regroupEl(cardSpellSorted);
    let cardTrapSorted = cardTrapArray.sort((a, b) => SortBySpellTrapType<TrapType>(trapSortJson, a, b));
    cardTrapSorted = cardTrapSorted.sort(SortByName);
    cardTrapSorted = regroupEl(cardTrapSorted);
    newCardInfoArray = newCardInfoArray.concat(cardSpellSorted);
    newCardInfoArray = newCardInfoArray.concat(cardTrapSorted);
    return newCardInfoArray;
}