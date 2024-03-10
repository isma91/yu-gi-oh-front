import React, { useState, useEffect } from "react";
import { ButtonTypeMap, Button as MUIButton } from "@mui/material";
import CircularProgress from "@components/feedback/CircularProgress";
import { ThemeColorEnumType } from "@app/types/Theme";
import { IconPositionEnumType } from "@app/types/Input";

type ButtonPropsType = {
    loading: boolean;
    children: React.ReactNode;
    loadingText?: string;
    fullWidth?: boolean;
    color?: ThemeColorEnumType;
    variant?: ButtonTypeMap["props"]["variant"];
    disabled?: boolean;
    type?: HTMLButtonElement["type"];
    className?: string;
    onClick?: (e: React.MouseEvent) => void;
    icon?: React.ReactNode;
    iconPosition?: IconPositionEnumType;
};

function Button(props: ButtonPropsType) {
    const { loading, children } = props;
    const [disabled, setDisabled] = useState<boolean>(false);
    let loadingText: string = "Please wait...";
    if (props.loadingText !== undefined) {
        loadingText = props.loadingText;
    }
    let fullWidth: boolean = true;
    if (props.fullWidth !== undefined) {
        fullWidth = props.fullWidth;
    }
    let color: ThemeColorEnumType = ThemeColorEnumType.PRIMARY;
    if (props.color !== undefined) {
        color = props.color;
    }
    let variant: ButtonTypeMap["props"]["variant"] = "outlined";
    if (props.variant !== undefined) {
        variant = props.variant;
    }
    let type: HTMLButtonElement["type"] = "submit";
    if (props.type !== undefined) {
        type = props.type;
    }
    let className = "";
    if (props.className !== undefined) {
        className = props.className;
    }

    let buttonOption: { startIcon?: React.ReactNode; endIcon?: React.ReactNode } = {};
    let iconPosition: IconPositionEnumType = IconPositionEnumType.START;
    if (props.iconPosition !== undefined) {
        iconPosition = props.iconPosition;
    }
    if (props.icon !== undefined) {
        buttonOption = {
            [`${iconPosition}Icon`]: props.icon,
        };
    }

    useEffect(() => {
        let propsDisabled = false;
        if (props.disabled !== undefined) {
            propsDisabled = props.disabled;
        }
        if (loading === false) {
            setDisabled(propsDisabled);
        } else {
            setDisabled(true);
        }
    }, [props]);

    const handleOnClick = (e: React.MouseEvent) => {
        if (props.onClick !== undefined) {
            props.onClick(e);
        }
    };

    return (
        <MUIButton
            onClick={handleOnClick}
            disabled={disabled}
            className={className}
            fullWidth={fullWidth}
            type={type}
            color={color}
            variant={variant}
            {...buttonOption}
        >
            {loading ? <CircularProgress color={color} /> : children}
        </MUIButton>
    );
}

export default Button;
