import { TextField, InputAdornment, FormControlTypeMap } from "@mui/material";
import { BasicInputPropsType, IconPositionEnumType, InputNumberInputPropsType, InputNumberInputPropsOptionType } from "@app/types/Input";

type InputNumberTypeType = "number" | "float";

type InputNumberPropsType = BasicInputPropsType & {
    icon?: React.ReactNode;
    iconPosition?: IconPositionEnumType;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    fullWidth?: boolean;
    type?: InputNumberTypeType;
    margin?: FormControlTypeMap["props"]["margin"];
    max?: number;
};

export default function InputNumber(props: InputNumberPropsType) {
    const { name, error } = props;
    const autoComplete = "current-" + name;

    let label: string = name.charAt(0).toUpperCase() + name.slice(1);
    if (props.label !== undefined) {
        label = props.label;
    }

    let optionInput: InputNumberInputPropsType = { required: true };
    let inputPropsOption: InputNumberInputPropsOptionType = {};

    let placeholder = label;
    if (props.placeholder !== undefined) {
        placeholder = props.placeholder;
    }
    let iconPosition: IconPositionEnumType = IconPositionEnumType.START;
    if (props.iconPosition !== undefined) {
        iconPosition = props.iconPosition;
    }
    if (props.icon !== undefined) {
        optionInput.InputProps = {
            [iconPosition + "Adornment"]: <InputAdornment position={iconPosition}>{props.icon}</InputAdornment>,
        };
    }
    if (props.required !== undefined) {
        optionInput.required = true;
    }
    if (props.optional !== undefined) {
        inputPropsOption.isoptional = "true";
        optionInput.required = false;
    }
    if (props.defaultValue !== undefined) {
        optionInput.defaultValue = props.defaultValue;
    }
    let fullWidth = true;
    if (props.fullWidth !== undefined) {
        fullWidth = props.fullWidth;
    }
    let type: InputNumberTypeType = "number";
    if (props.type !== undefined) {
        type = props.type;
    }
    if (type === "float") {
        inputPropsOption.step = 0.01;
    }
    let max: null | number = null;
    if (props.max !== undefined) {
        max = props.max;
        inputPropsOption.max = max;
    }
    let margin: FormControlTypeMap["props"]["margin"] = "normal";
    if (props.margin !== undefined) {
        margin = props.margin;
    }
    let disabled: boolean = false;
    if (props.disabled !== undefined) {
        disabled = props.disabled;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value: eTargetValue } = e.target;
        if (props.onChange) {
            props.onChange(e);
        }
    };

    return (
        <TextField
            disabled={disabled}
            error={error ? true : false}
            helperText={error ? error : ""}
            fullWidth={fullWidth}
            name={name}
            label={label}
            placeholder={placeholder}
            variant="outlined"
            type="number"
            autoComplete={autoComplete}
            {...optionInput}
            onChange={handleChange}
            onWheel={(e) => (e.target as HTMLElement).blur()}
            inputProps={{ ...inputPropsOption }}
            margin={margin}
        />
    );
}
