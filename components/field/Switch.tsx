import React, { useState } from "react";
import { FormControlLabel, Switch as SwitchMUI, Typography, Grid } from "@mui/material";
import { BasicInputPropsType } from "@app/types/Input";
import GenericStyles from "@app/css/style";

type SwitchPropsType = BasicInputPropsType & {
    helperText?: string;
    isOnOff?: true;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
};

type SwitchOptionType = {
    name: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    disabled: boolean;
    inputProps: {
        [key in string]: string;
    };
};

export default function Switch(props: SwitchPropsType) {
    const { name } = props;
    const genericClasses = GenericStyles();
    const [checked, setChecked] = useState<boolean>(false);
    let label: string = name.charAt(0).toUpperCase() + name.slice(1);
    if (props.label !== undefined) {
        label = props.label;
    }
    let helperText: string = "";
    if (props.helperText !== undefined) {
        helperText = props.helperText;
    }
    const isOnOff = props.isOnOff !== undefined;
    const color = "primary";

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setChecked(e.target.checked);
        if (props.onChange !== undefined) {
            props.onChange(e);
        }
    };

    let switchOption: SwitchOptionType = {
        name: name,
        onChange: handleChange,
        disabled: false,
        inputProps: {
            isoptional: "true",
        },
    };

    if (props.disabled !== undefined) {
        switchOption.disabled = props.disabled;
    }

    const displayOnOff = () => {
        const selectedClassName = `${genericClasses.colorPrimaryMain} ${genericClasses.bold}`;
        const nonSelectedClassName = `${genericClasses.bold} ${genericClasses.greyLight}`;
        return (
            <Grid container spacing={1} alignItems="center" component="label">
                <Grid item>
                    <Typography component="span">{label}</Typography>
                </Grid>
                <Grid item>
                    <Typography component="span" className={checked === false ? selectedClassName : nonSelectedClassName}>
                        No
                    </Typography>
                </Grid>
                <Grid item>
                    <SwitchMUI {...switchOption} color={color} />
                </Grid>
                <Grid item>
                    <Typography component="span" className={checked ? selectedClassName : nonSelectedClassName}>
                        Yes
                    </Typography>
                </Grid>
                {helperText !== "" ? (
                    <Grid item xs={12}>
                        {displayHelperText()}
                    </Grid>
                ) : null}
            </Grid>
        );
    };

    const displayHelperText = () => {
        return (
            <Typography component="em" className={`${genericClasses.greyLight} ${genericClasses.helperTextFontSize}`}>
                {helperText}
            </Typography>
        );
    };

    return isOnOff ? (
        displayOnOff()
    ) : (
        <>
            <FormControlLabel control={<SwitchMUI {...switchOption} color={color} />} label={label} labelPlacement="start" />
            {helperText !== "" ? displayHelperText() : null}
        </>
    );
}
