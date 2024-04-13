import { TableContentTypeType, TableContentType } from "@app/types/Table";

export function AddRowAction(url: string, newTab: boolean = true): TableContentType {
    return {
        field: TableContentTypeType.ROWACTION,
        type: TableContentTypeType.ROWACTION,
        value: "",
        url: url,
        newTab: newTab,
    };
}

export function AddButtonType(value: React.JSX.Element): TableContentType {
    return {
        type: TableContentTypeType.BUTTON,
        field: TableContentTypeType.BUTTON,
        value: value,
    };
}

export function AddActionField(value: React.JSX.Element): TableContentType {
    return {
        type: TableContentTypeType.ACTION,
        field: TableContentTypeType.ACTION,
        value: value,
    };
}