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
export function SortAscFromField<T>(array: Array<T>, field: string = "name", fieldIsString: boolean = true): Array<T> {
    let newArray = [...array];
    newArray.sort((a, b) => {
        let aValue: string | number;
        let bValue: string | number;
        if (fieldIsString === true) {
            aValue = a[field].toLowerCase() as string;
            bValue = b[field].toLowerCase() as string;
            return aValue.localeCompare(bValue);
        } else {
            aValue = a[field] as number;
            bValue = b[field] as number;
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
export function SortAscFromFieldArrayString<T>(array: Array<T>, fieldArrayString: string): T[] {
    let newArray = [...array];
    newArray.sort((a, b) => {
        let fieldAToCheck: string = "";
        let fieldBToCheck: string = "";
        const fieldArray = fieldArrayString.split(".");
        if (fieldArray.length === 1) {
            fieldAToCheck = a[fieldArray[0]];
            fieldBToCheck = b[fieldArray[0]];
        } else if (fieldArray.length === 2) {
            fieldAToCheck = a[fieldArray[0]][fieldArray[1]];
            fieldBToCheck = b[fieldArray[0]][fieldArray[1]];
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
 * Create array of number who begin at `from` with `length` length
 * @param {number} from 
 * @param {number} length 
 * @returns {number[]}
 */
export function CreateArrayNumber(from: number, length: number): number[] {
    let newArray: number[] = [];
    if (from === length) {
        return newArray;
    } else if (from > length) {
        const newFrom = length;
        length = from;
        from = newFrom;
    }
    for (let i = from; i <= length; i++) {
        newArray.push(i);
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