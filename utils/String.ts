/**
 * @param {string} string 
 * @returns {string}
 */
export function Capitalize(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * @param {string} text 
 * @param {number} length 
 * @returns {string}
 */
export function LimitText(text: string, length: number): string {
    if (!text || !length || text.length <= length) {
        return text;
    }
    let limitted = text.slice(0, length).trim();
    const index = limitted.lastIndexOf(" ");
    if (index !== -1) {
        limitted = limitted.slice(0, index);
    }
    limitted = limitted.replace(/[.,]*$/g, "");
    return `${limitted}...`;
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

function testRegex(regexString: string, val: string): boolean {
    const regex = new RegExp(regexString);
    return regex.test(val);
};

/**
 * 
 * @param {string} uuid 
 * @param {number} version Symfony Uuid version 
 * @returns {boolean}
 */
export function CheckUuid(uuid: string, version: number = 7): boolean {
    let regex = "";
    if (version === 7) {
        regex = "^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$";
    }
    return testRegex(regex, uuid);
}

/**
 * Pluralize basic word
 * @param {string} word 
 * @param {number} number 
 * @returns {string}
 */
export function Pluralize(word: string, number: number): string {
    const suffixe = (number > 0) ? "s" : "";
    return `${word}${suffixe}`;
}