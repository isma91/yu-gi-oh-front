import { CircularProgress as CircularProgressMUI } from "@mui/material";
import { ThemeColorEnumType } from "@app/types/Theme";

type CircularProgressPropsType = {
    color?: ThemeColorEnumType;
};

/**
 *
 * @param {CircularProgressPropsType} props
 * @returns {React.JSX.Element}
 */
export default function CircularProgress({ color }: CircularProgressPropsType): React.JSX.Element {
    if (color === undefined) {
        color = ThemeColorEnumType.PRIMARY;
    }
    return <CircularProgressMUI color={color} />;
}
