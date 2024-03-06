import { TextField, InputAdornment, FormControlTypeMap } from "@mui/material";
import { BasicInputPropsType, IconPositionEnumType, InputTextInputPropsType, InputTextInputPropsOptionType } from "@app/types/Input";

type InputTextAcceptedTypeType = (string & {}) & Omit<React.HTMLInputTypeAttribute, "number">;

type InputTextPropsType = BasicInputPropsType & {
    icon?: React.ReactNode;
    iconPosition?: IconPositionEnumType;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    textArea?: true;
    limit?: number;
    fullWidth?: boolean;
    type?: InputTextAcceptedTypeType;
    margin?: FormControlTypeMap["props"]["margin"];
    className?: string;
};

function InputText(props: InputTextPropsType) {
    const { name, error } = props;
    const autoComplete = "current-" + name;

    let label: string = name.charAt(0).toUpperCase() + name.slice(1);
    if (props.label !== undefined) {
        label = props.label;
    }

    let optionInput: InputTextInputPropsType = { required: true };
    let inputPropsOption: InputTextInputPropsOptionType = {};

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
    if (props.textArea !== undefined) {
        optionInput.multiline = true;
        if (props.limit !== undefined) {
            inputPropsOption.maxlength = props.limit;
        }
    }
    if (props.defaultValue !== undefined) {
        optionInput.defaultValue = props.defaultValue;
    }
    let disabled: boolean = false;
    if (props.disabled !== undefined) {
        disabled = props.disabled;
    }
    let fullWidth = true;
    if (props.fullWidth !== undefined) {
        fullWidth = props.fullWidth;
    }
    let type: InputTextAcceptedTypeType = "text";
    if (props.type !== undefined) {
        type = props.type;
    }
    let margin: FormControlTypeMap["props"]["margin"] = "normal";
    if (props.margin !== undefined) {
        margin = props.margin;
    }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (props.onChange) {
            props.onChange(e);
        }
    };
    let className = "";
    if (props.className !== undefined) {
        className = props.className;
    }

    return (
        <TextField
            error={error ? true : false}
            helperText={error ? error : ""}
            fullWidth={fullWidth}
            name={name}
            label={label}
            placeholder={placeholder}
            variant="outlined"
            className={className}
            type={type}
            autoComplete={autoComplete}
            disabled={disabled}
            {...optionInput}
            onChange={handleChange}
            inputProps={{ ...inputPropsOption }}
            margin={margin}
        />
    );
}

export default InputText;
