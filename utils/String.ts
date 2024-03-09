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