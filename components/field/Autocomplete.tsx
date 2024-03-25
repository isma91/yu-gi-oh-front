import React, { useState, useEffect, useCallback } from "react";
import {
    Autocomplete as AutocompleteMUI,
    FormControl,
    FormHelperText,
    TextField,
    InputAdornment,
    Typography,
    createFilterOptions,
    Theme,
    FilterOptionsState,
} from "@mui/material";
import { GetObjectValueFromKey } from "@utils/Parsing";
import { makeStyles } from "@mui/styles";
import { BasicInputMUIInputPropsOptionType, BasicInputPropsType, InputTextInputMUIInputPropsType } from "@app/types/Input";
import CircularProgress from "@components/feedback/CircularProgress";
import { CreateReactSyntheticEvent } from "@utils/Event";

const useStyles = makeStyles((theme: Theme) => ({
    autocompleteClearButton: {
        color: theme.palette.primary.main + " !important",
    },
}));

export type AutocompletePropsType = BasicInputPropsType & {
    options: object[];
    optionLabel: string;
    optionValue: string;
    loading: boolean;
    grouped?: true;
    groupBy?: string;
    multiple?: true;
    fullWidth?: boolean;
    icon?: React.ReactNode;
    helperText?: string;
    className?: string;
    onChange?: (event: React.SyntheticEvent, value: object | null | object[]) => void;
    defaultValue?: object | null | object[];
    loadingDefaultValue?: boolean;
    renderOption?: (props: React.HTMLAttributes<HTMLLIElement>, option: any) => React.JSX.Element;
};

type AutocompleteOptionType = {
    groupBy?: (option: object) => string;
    multiple: boolean;
    getOptionLabel?: (option: object) => string;
    renderOption?: (props: React.HTMLAttributes<HTMLLIElement>, option: any) => React.JSX.Element;
};

type AutocompleteInputOptionType = {
    required: boolean;
    className?: string;
};

interface AutocompleteValueObject extends Object {
    length: number;
}

export default function Autocomplete(props: AutocompletePropsType) {
    const { name, error, options, optionLabel, optionValue, loading, onChange: propsOnChange } = props;
    const classes = useStyles();
    const filter = createFilterOptions<object>();
    const optionLabelArray: string[] = optionLabel.split(".");
    const optionValueArray: string[] = optionValue.split(".");
    const [value, setValue] = useState<string>("");
    const [autoCompleteValue, setAutoCompleteValue] = useState<object[] | object>([]);
    const [onChangeString, setOnChangeString] = useState<string>("");
    const [skipDefaultValue, setSkipDefaultValue] = useState<boolean>(false);

    let optionAutoComplete: AutocompleteOptionType = {
        multiple: false,
    };
    let inputOptions: AutocompleteInputOptionType = {
        required: true,
    };

    const grouped = props.grouped !== undefined;
    const multiple = props.multiple !== undefined;
    optionAutoComplete.multiple = multiple;

    const handleChange = useCallback(
        (event: React.SyntheticEvent, value: object | object[] | null) => {
            let newValue: string = "";
            let newAutoCompleteValue: object[] | object = [];
            if (value !== null) {
                newAutoCompleteValue = value;
            }
            if (multiple === false) {
                if (value !== null) {
                    newValue = GetObjectValueFromKey(value, optionValueArray) as string;
                }
            } else {
                newAutoCompleteValue = [];
                if (value !== null && Array.isArray(value)) {
                    newAutoCompleteValue = value;
                    let arrayToTransformInValue: Array<string | number> = [];
                    for (let i = 0; i < value.length; i++) {
                        const el: object = value[i];
                        arrayToTransformInValue.push(GetObjectValueFromKey(el, optionValueArray));
                    }
                    newValue = arrayToTransformInValue.join(",");
                }
            }
            setValue(newValue);
            setAutoCompleteValue(newAutoCompleteValue);
            if (propsOnChange !== undefined) {
                propsOnChange(event, value);
            }
            setOnChangeString("");
        },
        [multiple, optionValueArray, propsOnChange]
    );

    let disabled: boolean = false;
    if (props.disabled !== undefined) {
        disabled = props.disabled;
    }

    let fullWidth: boolean = true;
    if (props.fullWidth !== undefined) {
        fullWidth = props.fullWidth;
    }

    if (grouped === true && props.groupBy !== undefined) {
        optionAutoComplete.groupBy = (option: object): string => {
            const groupBy = props.groupBy as keyof object;
            if (option[groupBy] !== undefined) {
                return option[groupBy];
            }
            return "";
        };
    }

    let label = name.charAt(0).toUpperCase() + name.slice(1);
    if (props.label) {
        label = props.label;
    }
    let placeholder = label;
    if (props.placeholder !== undefined) {
        placeholder = props.placeholder;
    }

    let inputPropsOption: BasicInputMUIInputPropsOptionType = {};
    if (props.optional !== undefined) {
        inputOptions.required = false;
        inputPropsOption.isoptional = "true";
    }

    let optionInputProps: InputTextInputMUIInputPropsType = {};
    if (props.icon !== undefined) {
        optionInputProps = {
            startAdornment: <InputAdornment position="start">{props.icon}</InputAdornment>,
        };
    }

    let helperText = "";
    if (props.helperText !== undefined) {
        helperText = props.helperText;
    }

    if (props.className !== undefined) {
        inputOptions.className = props.className;
    }

    /*const handleChange = (event: React.SyntheticEvent, value: object | object[] | null) => {
        let newValue: string = "";
        let newAutoCompleteValue: object[] | object = [];
        if (value !== null) {
            newAutoCompleteValue = value;
        }
        if (multiple === false) {
            if (value !== null) {
                newValue = GetObjectValueFromKey(value, optionValueArray) as string;
            }
        } else {
            newAutoCompleteValue = [];
            if (value !== null && Array.isArray(value)) {
                newAutoCompleteValue = value;
                let arrayToTransformInValue: Array<string | number> = [];
                for (let i = 0; i < value.length; i++) {
                    const el: object = value[i];
                    arrayToTransformInValue.push(GetObjectValueFromKey(el, optionValueArray));
                }
                newValue = arrayToTransformInValue.join(",");
            }
        }
        setValue(newValue);
        setAutoCompleteValue(newAutoCompleteValue);
        if (props.onChange) {
            props.onChange(event, value);
        }
        setOnChangeString("");
    };*/

    const handleFilterOptions = (options: object[], params: FilterOptionsState<object>): object[] => {
        params.inputValue = onChangeString;
        let filtered = filter(options, params);
        return filtered;
    };

    const displayUniqueValue = (): string | number => {
        let option: object | null = null;
        if (value !== "") {
            for (let i = 0; i < options.length; i++) {
                const el = options[i];
                if (GetObjectValueFromKey(el, optionValueArray) === value) {
                    option = el;
                    break;
                }
            }
        }
        if (option !== null) {
            return GetObjectValueFromKey(option, optionLabelArray);
        } else {
            return "";
        }
    };

    useEffect(() => {
        const propsDefaultValue = props.defaultValue;
        const propsLoadingDefaultValue = props.loadingDefaultValue;
        if (skipDefaultValue === false && propsDefaultValue !== undefined && propsDefaultValue !== null && options.length !== 0) {
            if (
                (multiple === true && Array.isArray(propsDefaultValue) === true && propsDefaultValue.length !== 0) ||
                (multiple === false &&
                    Array.isArray(propsDefaultValue) === false &&
                    typeof propsDefaultValue === "object" &&
                    Object.keys(propsDefaultValue).length !== 0)
            ) {
                const event = CreateReactSyntheticEvent();
                handleChange(event, propsDefaultValue);
                setAutoCompleteValue(propsDefaultValue);
                setSkipDefaultValue(true);
            }
        }
        if ((propsLoadingDefaultValue === undefined && propsLoadingDefaultValue === false) || propsDefaultValue === undefined) {
            setSkipDefaultValue(true);
        }
    }, [props.defaultValue, props.loadingDefaultValue, multiple, options.length, skipDefaultValue, handleChange]);

    if (props.renderOption !== undefined) {
        optionAutoComplete.renderOption = props.renderOption;
    }

    return (
        <FormControl fullWidth={fullWidth}>
            <AutocompleteMUI
                disabled={disabled}
                value={autoCompleteValue}
                {...optionAutoComplete}
                fullWidth={fullWidth}
                options={options}
                getOptionLabel={(option: object) => GetObjectValueFromKey(option, optionLabelArray) as string}
                onChange={handleChange}
                filterOptions={handleFilterOptions}
                loading={loading}
                classes={{
                    clearIndicator: classes.autocompleteClearButton,
                }}
                renderInput={(params) => (
                    <TextField
                        error={error ? true : false}
                        {...params}
                        {...inputOptions}
                        name={name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            let targetValue = e.target.value;
                            if (targetValue.substring(0, value.length) === value) {
                                targetValue = targetValue.substring(value.length);
                            }
                            setOnChangeString(targetValue);
                        }}
                        label={label}
                        placeholder={placeholder}
                        variant="outlined"
                        fullWidth={fullWidth}
                        inputProps={{
                            ...params.inputProps,
                            ...inputPropsOption,
                            autocompletevalue: value,
                            value: onChangeString !== "" ? onChangeString : multiple ? value : displayUniqueValue(),
                            style: onChangeString !== "" ? {} : multiple ? { opacity: 0 } : {},
                        }}
                        InputProps={{
                            ...params.InputProps,
                            ...optionInputProps,
                            endAdornment: (
                                <>
                                    {loading ? <CircularProgress /> : null}
                                    {params.InputProps.endAdornment}
                                </>
                            ),
                        }}
                    />
                )}
            />
            {error ? <FormHelperText>{error}</FormHelperText> : null}
            {helperText !== "" ? (
                <FormHelperText>
                    <Typography component="em">{helperText}</Typography>
                </FormHelperText>
            ) : null}
        </FormControl>
    );
}
