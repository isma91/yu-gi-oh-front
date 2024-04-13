export type TableHeaderType = {
    name: string;
    field: string;
    noSort?: true | undefined;
};

export enum TableContentTypeType {
    ACTION = "action",
    ROWACTION = "rowAction",
    BUTTON = "button",
    TEXT = "text",
};

export type TableContentValueType = string | number | React.JSX.Element;

export type TableContentType = {
    type?: TableContentTypeType;
    url?: string;
    newTab?: boolean;
    field: string;
    value: TableContentValueType;
    class?: string;
    search?: string | number;
};