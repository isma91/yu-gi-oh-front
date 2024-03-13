/**
 * @param {string} url 
 * @param {T | null} option 
 * @returns 
 */
export function GetFullRouteFromRouteNameAndRouteOption
    <T extends { [key in string]: string }>
    (url: string, option: T | null = null): string {
    if (option !== null) {
        const optionKeyArray = Object.keys(option);
        optionKeyArray.forEach((optionKey) => {
            const optionValue = option[optionKey as string];
            if (url.includes(optionKey) === true) {
                const optionKeyForUrl = `{${optionKey}}`;
                url = url.replace(optionKeyForUrl, optionValue);
            }
        })
    }
    return url;
}