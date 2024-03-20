import { CircularProgress as CircularProgressMUI } from "@mui/material";
import { InputColorType } from "@app/types/Input";

type CircularProgressPropsType = {
    color?: InputColorType;
};

/**
 *
 * @param {CircularProgressPropsType} props
 * @returns {React.JSX.Element}
 */
export default function CircularProgress({ color }: CircularProgressPropsType): React.JSX.Element {
    if (color === undefined) {
        color = "primary";
    }
    return <CircularProgressMUI color={color} />;
}
