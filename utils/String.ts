/**
 * @param {string} string 
 * @returns {string}
 */
export function Capitalize(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * @param {string | number} string 
 * @param {number} [length=2] 
 * @returns {string}
 */
export function FulfillZero(string: string | number, length: number = 2): string {
    if (length < 2) {
        length = 2;
    }
    return string.toString().padStart(length, "0")
}

/**
 * @param {string} base 
 * @param {number} index 
 * @returns {string}
 */
export function AddIndexForFieldMultiple(base: string, index: number): string {
    return `${base}[${index}]`;
}

/**
 * @param string 
 * @returns {[number | null, string | null]}
 */
export function SplitNumberAndLetter(string: string): [number | null, string | null] {
    let responseNumber: number | null = null;
    let responseLetter: string | null = null;
    const regexNumber = new RegExp(/[0-9]+/g);
    const regexLetter = new RegExp(/[a-zA-Z]+/g);
    const matchNumberArray = string.match(regexNumber);
    const matchLetterArray = string.match(regexLetter);
    if (matchNumberArray !== null) {
        responseNumber = parseInt(matchNumberArray[0], 10);
    }
    if (matchLetterArray !== null) {
        responseLetter = matchLetterArray[0];
    }
    return [responseNumber, responseLetter];
}