import { FormControlTypeMap } from "@mui/material";

export type BasicInputPropsType = {
    name: string;
    error: string | undefined;
    label?: string;
    placeholder?: string;
    required?: boolean;
    optional?: true;
    defaultValue?: InputTextValueType;
    disabled?: boolean;
    id?: string;
}

export type BasicInputMUIInputPropsOptionType = {
    isoptional?: string;
};

export type InputColorType = 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';

export enum IconPositionEnumType {
    START = 'start',
    END = 'end',
};

export type InputTextInputMUIInputPropsType = {
    startAdornment?: React.ReactNode;
    endAdornment?: React.ReactNode;
}

export type InputTextInputPropsType = {
    required: boolean;
    InputProps?: InputTextInputMUIInputPropsType;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    multiline?: true;
    defaultValue?: InputTextValueType;
};

export type InputTextInputPropsOptionType = {
    isoptional?: string;
    maxlength?: number;
    margin?: FormControlTypeMap["props"]["margin"];
    id?: string;
};

export type InputTextValueType = unknown | null;

export type InputNumberInputPropsType = Omit<InputTextInputPropsType, "multiline"> & {
}
export type InputNumberInputPropsOptionType = Omit<InputTextInputPropsOptionType, "maxlength"> & {
    step?: number;
    max?: number;
    min?: number;
}