import { useEffect, useState } from "react";
import { ParsedUrlQuery } from "querystring";

export default function useRouterQuery(routerQuery: ParsedUrlQuery): { query: ParsedUrlQuery, loading: boolean} {
    const [query, setQuery] = useState<ParsedUrlQuery>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [countMillisecond, setCountMillisecond] = useState<number>(0);
    const [intervalId, setIntervalId] = useState<number | null>(null);
    const millisecond = 100;
    const maxMillisecond = 500;

    const getObjectLength = (object: object): number => {
        return Object.keys(object).length;
    }

    /**
     * Reset the timer when the value is not the same as the routerQuery finded.
     * We actually compare with the number of key they have, pretty basic comparation.
     * Create setInterval if we don't have one (intervalId = NULL).
     * This interval gonna incremate countMillisecond to 100 every 100 millisecond to wait 500 millisecond (maxMillisecond value).
     * When the countMillisecond is in front of maxMillisecond, we clear the interval and finally set loading to false.
     */
    useEffect(() => {
        if (loading === true) {
            const routerQueryLength = getObjectLength(routerQuery);
            const queryLength = getObjectLength(query);
            if (routerQueryLength !== queryLength) {
                setQuery(routerQuery);
                setCountMillisecond(0);
            }
            if (intervalId === null) {
                setIntervalId(window.setInterval(() => setCountMillisecond((prevState) => prevState + millisecond), millisecond));
            }
            if (countMillisecond >= maxMillisecond) {
                if (intervalId !== null) {
                    clearInterval(intervalId);
                }
                setLoading(false);
            }
        }
    }, [routerQuery, countMillisecond]);

    return { query: query, loading: loading };
}