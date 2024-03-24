import { WindowSizeType } from "@app/types/Window";

export function GetLocalStorageValue(key: string): string | null {
    let value: string | null = null;
    if (typeof window !== "undefined") {
        value = window.localStorage.getItem(key);
    }
    return value;
}



/**
 * Find the Client Width/Height
 * @param {number} width the default value in case we have null
 * @param {number} height the default value in case we have null
 * @returns {WindowSizeType}
 */
export function GetWindowSize(width: number, height: number): WindowSizeType {
    let wY = height;
    let wX = width;
    if (typeof window !== "undefined") {
        if (window.innerWidth) {
            wX = window.innerWidth;
        }
        if (window.innerHeight) {
            wY = window.innerHeight;
        }
    } else if (typeof document !== "undefined") {
        if (document.body.clientWidth) {
            wX = document.body.clientWidth;
        }
        if (document.body.clientHeight) {
            wY = document.body.clientHeight;
        }
    }
    return { width: wX, height: wY };
}