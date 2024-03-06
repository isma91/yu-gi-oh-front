import { ChangeEvent, useState, useEffect } from "react";
import { Typography, Select as SelectMUI, FormControl, FormHelperText, InputLabel } from "@mui/material";
import CircularProgress from "@components/feedback/CircularProgress";
import GenericStyles from "@app/css/style";
import { BasicInputPropsType } from "@app/types/Input";
import { CompareTwoArray } from "@utils/Array";

type SelectValueType = string | number | Array<unknown>;

type SelectPropsType = BasicInputPropsType & {
    children: React.ReactNode;
    multiple?: true;
    closeOnChange?: true;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    fullWidth?: boolean;
    helperText?: string;
    className?: string;
    loading: boolean;
    defaultValue?: SelectValueType;
    value?: SelectValueType;
};

type SelectOptionsType = {
    required: boolean;
    multiple?: boolean;
    isoptional?: string;
    className?: string;
};

export default function Select(props: SelectPropsType) {
    const { name, error, children } = props;
    const genericClasses = GenericStyles();
    let label = name.charAt(0).toUpperCase() + name.slice(1);
    if (props.label !== undefined) {
        label = props.label;
    }
    let selectOptions: SelectOptionsType = { required: true };
    let initialValue: SelectValueType = "";
    if (props.multiple !== undefined) {
        selectOptions.multiple = true;
        initialValue = [];
    }
    const valueState = useState<SelectValueType>(initialValue);
    const setValue = valueState[1];
    let value: SelectValueType;
    if (props.value !== undefined) {
        value = props.value;
    } else {
        value = valueState[0];
    }
    const [open, setOpen] = useState<boolean>(false);
    const [skipDefaultValue, setSkipDefaultValue] = useState<boolean>(false);

    let disabled: boolean = false;
    if (props.disabled !== undefined) {
        disabled = props.disabled;
    }
    let closeOnChange = false;
    if (props.closeOnChange !== undefined) {
        closeOnChange = true;
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
        if (props.onChange) {
            props.onChange(event);
        }
        if (closeOnChange === true && open === true) {
            setOpen(false);
        }
        if (props.multiple !== undefined) {
            setOpen(!open);
        }
    };
    let fullWidth = true;
    if (props.fullWidth !== undefined) {
        fullWidth = props.fullWidth;
    }
    let helperText: boolean | string = false;
    if (props.helperText !== undefined) {
        helperText = props.helperText;
    }
    if (props.required !== undefined) {
        selectOptions.required = true;
    }
    if (props.optional !== undefined) {
        selectOptions.isoptional = "true";
        selectOptions.required = false;
    }
    if (props.className !== undefined) {
        selectOptions.className = props.className;
    }
    const labelId = `select-${name}`;

    useEffect(() => {
        const propsMultiple = props.multiple;
        const propsDefaultValue = props.defaultValue;
        const propsLoading = props.loading;
        if (skipDefaultValue === false && propsLoading === false && propsDefaultValue !== undefined) {
            /**
             * We compare the arrays in case this Select is multiple or juste put in value if it's unique
             */
            if (
                propsMultiple === undefined ||
                (propsMultiple === true && CompareTwoArray(value as Array<unknown>, propsDefaultValue as Array<unknown>) === true)
            ) {
                setValue(propsDefaultValue);
            }
            setSkipDefaultValue(true);
        }
    }, [props]);

    return (
        <>
            {props.loading === true ? (
                <div style={{ textAlign: "center" }}>
                    <CircularProgress />
                </div>
            ) : (
                <FormControl fullWidth={fullWidth} variant="outlined">
                    <InputLabel id={labelId}>
                        <Typography component="p" align="center">
                            {label}
                            {selectOptions.required === true && label.substring(label.length - 1) !== "*" ? "*" : null}
                        </Typography>
                    </InputLabel>
                    <SelectMUI
                        open={open}
                        onOpen={() => setOpen(true)}
                        onClose={() => setOpen(false)}
                        inputProps={{ ...selectOptions }}
                        error={error ? true : false}
                        value={value}
                        onChange={handleChange}
                        labelId={labelId}
                        name={name}
                        label={label}
                        disabled={disabled}
                    >
                        {children}
                    </SelectMUI>
                    {error ? (
                        <FormHelperText error={true} variant="outlined">
                            {error}
                        </FormHelperText>
                    ) : null}
                    {helperText !== false ? (
                        <Typography component="em" className={`${genericClasses.greyLight} ${genericClasses.helperTextFontSize}`}>
                            {helperText}
                        </Typography>
                    ) : null}
                </FormControl>
            )}
        </>
    );
}
