/**
 * @param {ArrayType} array1 
 * @param {ArrayType} array2 
 * @returns {boolean}
 */
export function CompareTwoArray<ArrayType>(array1: ArrayType, array2: ArrayType): boolean {
    if (!array1 || !array2) {
        return false;
    }
    if (array1 instanceof Array === false || array2 instanceof Array === false) {
        return false;
    }
    if (array1.length !== array2.length) {
        return false;
    }
    for (var i = 0; i < array1.length; i++) {
        if (array1[i] instanceof Array && array2[i] instanceof Array) {
            if (CompareTwoArray<Array<unknown>>(array1[i], array2[i])) {
                return false;
            }
        } else if (array1[i] !== array2[i]) {
            /**
             * Warning - two different object instances will never be equal: { x: 20 } != { x: 20 }
             */
            return false;
        }
    }
    return true;
}

/**
 * @param {Array<T>} array 
 * @param {string} field 
 * @param {boolean} fieldIsString 
 * @returns {Array<T>}
 */
export function SortAscFromField<T extends { [key in string]: any}>(array: Array<T>, field: string = "name", fieldIsString: boolean = true): Array<T> {
    let newArray = [...array];
    newArray.sort((a, b) => {
        let aValue: string | number;
        let bValue: string | number;
        let aField: string | number = a[field as keyof T];
        let bField: string | number = b[field as keyof T];
        if (fieldIsString === true) {
            aField = aField as string;
            bField = bField as string;
            aValue = aField.toLowerCase() as string;
            bValue = bField.toLowerCase() as string;
            return aValue.localeCompare(bValue);
        } else {
            aValue = aField as number;
            bValue = bField as number;
            return aValue - bValue;
        }
    });
    return newArray;
}

/**
 * @param {Array<T>} array 
 * @param {string} fieldArrayString 
 * @returns {T[]}
 */
export function SortAscFromFieldArrayString<T extends {[key in string] : any}>(array: Array<T>, fieldArrayString: string): T[] {
    let newArray = [...array];
    newArray.sort((a, b) => {
        let fieldAToCheck: string = "";
        let fieldBToCheck: string = "";
        const fieldArray = fieldArrayString.split(".");
        if (fieldArray.length === 1) {
            const fieldArrayToUse: keyof T = fieldArray[0];
            fieldAToCheck = a[fieldArrayToUse] as string;
            fieldBToCheck = b[fieldArrayToUse] as string;
        } else if (fieldArray.length === 2) {
            const fieldArrayZero: keyof T = fieldArray[0];
            const fieldArrayOne: keyof T = fieldArray[1];
            fieldAToCheck = a[fieldArrayZero][fieldArrayOne] as string;
            fieldBToCheck = b[fieldArrayZero][fieldArrayOne] as string;
        }
        return fieldAToCheck.toLowerCase().localeCompare(fieldBToCheck.toLocaleLowerCase());
    })
    return newArray;
}

/**
 * 
 * @param {T[]} array 
 * @param {number[]} indexes 
 * @returns {T[]}
 */
export function SpliceMultiple<T>(array: T[], indexes: number[]): T[] {
    if (indexes.length === 0) {
        return array;
    }
    indexes.sort((a, b) => a - b);
    let newArray = [...array];
    for (let i = indexes.length - 1; i >= 0; i--) {
        newArray.splice(indexes[i], 1);
    }
    return newArray;
}

/**
 * 
 * @param {any[]} array 
 * @param {number} number must be supperior than 1 
 * @returns {any[]}
 * @throws {RangeError}
 */
export function GetRandomElement(array: any[], number: number): any[] {
    let newArray: any[] = [];
    if (number < 1) {
        throw new RangeError("number parameter must be at least 1");
    }
    if (number === 1) {
        newArray = array[Math.floor(Math.random() * array.length)]
    } else {
        const randomizedArray = array.sort(() => 0.5 - Math.random());
        newArray = randomizedArray.slice(0, number);
    }
    return newArray;
}

/**
 * Function to use when we have Array<{..., fieldName => children[]}>
 * @param {T[]} array 
 * @param {string} fieldName 
 * @returns {T[]}
 */
export function SortAscForArrayWithChildren<T extends { [key in string]: any }>(array: T[], fieldName: string): T[] {
    const sortedArray = SortAscFromField(array);
    let newArray = [];
    for (let i = 0; i < sortedArray.length; i++) {
        const el = sortedArray[i];
        newArray.push({ ...el, [fieldName]: SortAscFromField(el[fieldName]) });
    }
    return newArray;
}