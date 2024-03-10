/**
 * 
 * @param {object} object 
 * @param {string | string[]} key 
 * @returns {string}
 */
export function GetObjectValueFromKey(object: object, key: string | string[]): string | number {
    let value: string | number = "";
    let keySplit: Array<keyof object> = [];
    const keyIsArray: boolean = Array.isArray(key);
    if (keyIsArray === true) {
        keySplit = key as Array<keyof object>;
    } else {
        key = key as string;
        keySplit = key.split(".") as Array<keyof object>;
    }
    if (keySplit.length === 1 && object[keySplit[0]] !== undefined) {
        value = object[keySplit[0]];
    } else if (keySplit.length === 2 && object[keySplit[0]] !== undefined && object[keySplit[0]][keySplit[1]] !== undefined) {
        value = object[keySplit[0]][keySplit[1]];
    }
    return value;
}

/**
 * 
 * @param {object[]} array 
 * @param {string} groupLabel 
 * @param {string} labelToTake 
 * @param {string} newLabelName 
 * @returns {any[]}
 */
export function SortArrayJsonForAutocomplete(array: object[], groupLabel: string, labelToTake: string, newLabelName: string): any[] {
    let newArray: object[] = [];
    for (let i = 0; i < array.length; i++) {
        const el = array[i];
        const elLabelToTake : any[] = el[labelToTake as keyof object];
        if (elLabelToTake !== undefined && Array.isArray(elLabelToTake) === true) {
            for (let j = 0; j < elLabelToTake.length; j++) {
                const el2 = elLabelToTake[j];
                const elGroupLabel = el[groupLabel as keyof object];
                if (elGroupLabel !== undefined && elGroupLabel !== null) {
                    newArray.push({
                        [groupLabel]: elGroupLabel,
                        [newLabelName]: el2,
                    });
                }
            }
        }
    }
    return newArray;
}

/**
 * 
 * @param {T[]} array 
 * @param {string} fieldName 
 * @param {string | number} fieldValue 
 * @returns  {null | number}
 */
export function GetIndexArray<T extends {[key in string]: any}>(array: T[], fieldName: string, fieldValue: string | number): null | number {
    let index: number | null = null;
    for (let i = 0; i < array.length; i++) {
        const el = array[i];
        const elFieldValue = el[fieldName];
        if (elFieldValue !== undefined && elFieldValue !== null && elFieldValue === fieldValue) {
            index = i;
            break;
        }
    }
    return index;
}

/**
 * @param {object[]} values 
 * @param {T[]} array 
 * @param {{[key in string]: string}} key 
 * @returns {T[]}
 */
export function GetDefaultValueForAutocomplete<T extends object>(values: object[], array: T[], key: {[key in string]: string}): T[] {
    const keyValue = Object.keys(key)[0];
    const keyArray = key[keyValue];
    let defaultValues: T[] = [];
    let valuesValues: Array<string | number> = [];
    for (let i = 0; i < values.length; i++) {
        const el = values[i];
        const valueToCompareFromValues = GetObjectValueFromKey(el, keyValue);
        valuesValues.push(valueToCompareFromValues);
    }
    let count = 0;
    loop1: for (let j = 0; j < valuesValues.length; j++) {
        const el2 = valuesValues[j];
        for (let k = 0; k < array.length; k++) {
            const el3 = array[k];
            const valueToCompareFromArray = GetObjectValueFromKey(el3, keyArray);
            if (valueToCompareFromArray === el2) {
                defaultValues.push(el3);
                count++;
                if (count === valuesValues.length) {
                    break loop1;
                }
                continue loop1;
            }
        }
    }
    return defaultValues;
}