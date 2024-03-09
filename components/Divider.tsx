import { ThemeColorEnumType } from "@app/types/Theme";
import { DividerOwnProps, Divider as MUIDivider } from "@mui/material";
import GenericStyles from "@app/css/style";

type DividerProps = {
    variant?: DividerOwnProps["variant"];
    thickness?: number;
    color?: ThemeColorEnumType;
};

export default function Divider(props: DividerProps): React.JSX.Element {
    const genericClasses = GenericStyles();
    let variant: DividerOwnProps["variant"] = "fullWidth";
    if (props.variant !== undefined) {
        variant = props.variant;
    }
    let thickness: number = 2;
    if (props.thickness !== undefined) {
        thickness = props.thickness;
    }
    let color: ThemeColorEnumType = ThemeColorEnumType.PRIMARY;
    if (props.color !== undefined) {
        color = props.color;
    }
    let className: string = "";
    if (color === ThemeColorEnumType.PRIMARY) {
        className = genericClasses.backgroundColorPrimaryMain;
    } else if (color === ThemeColorEnumType.SECONDARY) {
        className = genericClasses.backgroundColorSecondaryMain;
    } else {
        className = genericClasses.backgroundColorThirdMain;
    }

    return <MUIDivider variant={variant} className={className} sx={{ borderBottomWidth: thickness }} />;
}
