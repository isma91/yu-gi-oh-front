import { AlertColor, Alert as AlertMUI, AlertTitle } from "@mui/material";

type AlertVariantType = "outlined" | "standard" | "filled";

type AlertPropsType = {
    message: string;
    severity?: AlertColor;
    title?: string;
    variant?: AlertVariantType;
    className?: string;
};

export default function Alert(props: AlertPropsType) {
    const { message } = props;

    let variant: AlertVariantType = "filled";
    if (props.variant !== undefined) {
        variant = props.variant;
    }
    let severity: AlertColor = "info";
    if (props.severity !== undefined) {
        severity = props.severity;
    }
    let title: null | string = null;
    if (props.title !== undefined) {
        title = props.title;
    }
    let className = "";
    if (props.className !== undefined) {
        className = props.className;
    }

    return (
        <AlertMUI severity={severity} variant={variant} className={className}>
            {title !== null ? <AlertTitle>{title}</AlertTitle> : null}
            {message}
        </AlertMUI>
    );
}
