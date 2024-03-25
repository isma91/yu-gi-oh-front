import React, { useRef, useEffect } from "react";
import { FadeLoading } from "@utils/Loading";
import Image from "next/image";

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
    }, [loadingRef, setLoading]);

    return (
        <div id="div-loading" ref={loadingRef}>
            <Image height={0} width={0} sizes="100vw" src="/static/images/loading.png" alt="Millenium puzzle with blue halo" />
        </div>
    );
}
