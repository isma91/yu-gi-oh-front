import React, { useRef, useEffect } from "react";
import { FadeLoading } from "@utils/Loading";

type LoadingPagePropsType = {
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function LoadingPage(props: LoadingPagePropsType): React.JSX.Element {
    const { setLoading } = props;
    const loadingRef = useRef<any>(null);

    useEffect(() => {
        if (loadingRef.current !== null) {
            FadeLoading(setLoading);
        }
    }, [loadingRef]);

    return (
        <div id="div-loading" ref={loadingRef}>
            <img src="/static/images/loading.png" alt="Loading..." />
        </div>
    );
}
