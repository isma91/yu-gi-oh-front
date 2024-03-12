/**
 * @param {React.Dispatch<React.SetStateAction<boolean>>} setLoading 
 */
export function FadeLoading(setLoading: React.Dispatch<React.SetStateAction<boolean>>) {
    const loadingEl = document.getElementById("div-loading");
    const fadeEffect = setInterval(() => {
        //Must check because after clear because the div can be removed from the _app.tsx condition.
        //Can't use variable becuase it's updated every cycle of interval
        if (loadingEl !== null) {
            let loadingElOpacityNumber = 1;
            if (loadingEl.style.opacity === "") {
                loadingEl.style.opacity = "1";
            } else if (parseFloat(loadingEl.style.opacity) > 0) {
                loadingElOpacityNumber = parseFloat(loadingEl.style.opacity);
                loadingElOpacityNumber -= 0.1;
                loadingEl.style.opacity = loadingElOpacityNumber.toFixed(1);
            } else {
                setLoading(false);
                clearInterval(fadeEffect);
            }
        }
    }, 100);
}