import React, { useRef } from "react";

type FormPropsType = {
    setValues: React.Dispatch<React.SetStateAction<{}>>;
    setErrors: React.Dispatch<React.SetStateAction<{}>>;
    fields: string[];
    children: React.ReactNode;
};

type ErrorsType = {
    [key in string]: string | undefined;
};

type ValuesType = { [key in string]: any };

export default function Form({ setValues, setErrors, fields, children }: FormPropsType): React.JSX.Element {
    const formRef = useRef<HTMLFormElement | null>(null);

    const checkConfirm = (
        check: boolean,
        values: ValuesType,
        errors: ErrorsType,
        field: string,
        confirmField: string,
        errorMsg: string
    ): ErrorsType => {
        if (check === true && values[field] !== values[confirmField]) {
            errors[field] = errorMsg;
            errors[confirmField] = errorMsg;
        }
        return errors;
    };

    const handleSubmit = function (event: React.FormEvent<Element>) {
        event.preventDefault();
        if (formRef.current === null) {
            return false;
        }
        let values: ValuesType = {};
        let errors: ErrorsType = {};
        const elements: HTMLFormControlsCollection = formRef.current.elements;
        const checkConfirmPassword: boolean = fields.includes("password") && fields.includes("confirmPassword");
        const checkConfirmEmail: boolean = fields.includes("email") && fields.includes("confirmEmail");
        const confirmPasswordErrorMsg = "Password and confirm must be the same.";
        const confirmEmailErrorMsg = "Email and confirm must be the same.";
        for (let i = 0; i < fields.length; i++) {
            /**
             * fieldName is the reference, never gonna be changed and use it
             * when this field has error.
             * elementName gonna be substring to check it's type and it's gonna
             * be the true name when we gonna send it to the backend
             */
            const fieldName = fields[i];
            let elementName = fieldName;
            const element = elements.namedItem(fieldName) as HTMLInputElement;
            /**
             * Condition to avoid critical error when we try to find
             * an input who don't exist
             */
            if (element instanceof Element === false || element === null) {
                continue;
            }
            const elementAttributes: NamedNodeMap = element.attributes;
            const { type: elementType, files: elementFiles }: { type: string; files: FileList | null } = element;
            const isOptional: boolean = elementAttributes.getNamedItem("isoptional") !== null;
            let isFile: boolean = false;
            let elementValue: string = element.value;
            if (fieldName.substring(0, 5) === "file_") {
                isFile = true;
                if (elementFiles === null || elementFiles.length === 0) {
                    elementValue = "";
                }
            } else if (fieldName.substring(0, 13) === "autocomplete_") {
                elementName = fieldName.substring(13);
                const autocompleteAttribute: Attr | null = elementAttributes.getNamedItem("autocompletevalue");
                elementValue = autocompleteAttribute !== null ? autocompleteAttribute.value : "";
            } else if (elementType === "radio" || elementType === "checkbox") {
                elementValue = element["checked"] === true ? "true" : "";
            } else if (elementType === "password") {
                if (elementValue.trim() === "") {
                    elementValue = "";
                }
            } else if (fieldName === "dateStart" && elementValue !== null && elementValue.trim() !== "") {
                elementValue += " 00:00:00";
            } else if (fieldName === "dateEnd" && elementValue !== null && elementValue.trim() !== "") {
                elementValue += " 23:59:59";
            }
            values[elementName] = elementValue;
            if (isOptional === false && elementValue === "") {
                errors[elementName] = "Please fulfill the wanted field.";
            }
            if (isFile === true && elementFiles !== null && elementFiles.length > 0) {
                values[elementName] = elementFiles;
            }
        }
        errors = checkConfirm(checkConfirmPassword, values, errors, "password", "confirmPassword", confirmPasswordErrorMsg);
        errors = checkConfirm(checkConfirmEmail, values, errors, "email", "confirmEmail", confirmEmailErrorMsg);
        setErrors(errors);
        setValues(values);
    };

    return (
        <form action="POST" onSubmit={handleSubmit} ref={formRef} encType="multipart/form-data">
            {children}
        </form>
    );
}
