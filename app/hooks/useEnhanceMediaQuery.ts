import { useEffect, useState } from "react";
import { useMediaQuery } from "@mui/material";

export default function useEnhancedMediaQuery(query: string) : { value: boolean | null, loading: boolean} {
    const [value, setValue] = useState<boolean | null>(null);
    const [countMillisecond, setCountMillisecond] = useState<number>(0);
    const [intervalId, setIntervalId] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const mediaQuery: boolean = useMediaQuery(query);
    const millisecond = 100;
    const maxMillisecond = 500;

    /**
     * Reset the timer when the value is not the same as the mediaQuery finded.
     * Create setInterval if we don't have one (intervalId = NULL).
     * This interval gonna incremate countMillisecond to 100 every 100 millisecond to wait 500 millisecond (maxMillisecond value).
     * When the countMillisecond is in front of maxMillisecond, we clear the interval and finally set loading to false.
     */
    useEffect(() => {
        if (loading === true) {
            if (value !== mediaQuery) {
                setValue(mediaQuery);
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
    }, [mediaQuery, countMillisecond]);

    return { value: value, loading: loading };
}
