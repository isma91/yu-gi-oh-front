export function AddApiBaseUrl(url: string) {
    const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (NEXT_PUBLIC_API_BASE_URL === undefined) {
        return "";
    }
    return `${NEXT_PUBLIC_API_BASE_URL}${url}`;
}