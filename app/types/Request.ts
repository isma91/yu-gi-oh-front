export type RequestDataType<FieldName extends string, Type> = {
    error?: string | null;
    success?: string | null;
    data: {
        [key in FieldName]: Type
    }
};

export type RequestGetAll<F extends string, T> = RequestDataType<F, T[]>;

export type RequestGetInfo<F extends string, T> = RequestDataType<F, T | null>;

export type RequestSuccessWithDataType<F extends string, T> = Omit<RequestDataType<F, T>, "error"> & {
    success: string;
};

export type RequestSuccessType = {
    success: string;
    data: null;
};

export type RequestErrorWithDataType<F extends string, T> = Omit<RequestDataType<F, T>, "success"> & {
    error: string;
};

export type RequestErrorType = {
    error: string;
    data: null;
};