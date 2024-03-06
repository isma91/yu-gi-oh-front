/**
 * 
 * @param {T} props 
 * @returns {Promise<T>}
 */
export function ResolvePromise<T>(props: T): Promise<T> {
    return new Promise((resolve: any, reject: any): void => {
        resolve(props);
    });
}

/**
 * 
 * @param {number} delay 
 * @returns {Promise<T>}
 */
export function DelayResolvePromise<T>(delay: number): Promise<T> {
    return new Promise((resolve: any): void => {
        setTimeout(resolve, delay);
    });
}

/**
 * 
 * @param {T} props 
 * @returns {Promise<T>}
 */
export function RejectPromise<T>(props: T): Promise<T> {
    return new Promise((resolve: any, reject: any): void => {
        reject(props);
    });
}
