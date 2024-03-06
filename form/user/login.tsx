"use client";
import React, { useState, useEffect, useContext } from "react";
import InputText from "@components/field/InputText";
import Form from "@components/util/Form";
import Button from "@components/field/Button";
import LoginRequest from "@api/User/Auth/Login";
import { StoreContext } from "@app/lib/state-provider";
import { useSnackbar } from "notistack";
import { useRouter } from "next/router";
import { ActionNameType } from "@app/types/GlobalState";

type ErrorsType = {
    username?: string | undefined;
    password?: string | undefined;
};

export default function LoginForm(): React.JSX.Element {
    const router = useRouter();
    const { dispatch } = useContext(StoreContext);
    const [loading, setLoading] = useState<boolean>(false);
    const [values, setValues] = useState({});
    const [errors, setErrors] = useState<ErrorsType>({});
    const { enqueueSnackbar } = useSnackbar();

    const sendLoginReq = async (data: object): Promise<void> => {
        return LoginRequest(data)
            .then((res) => {
                dispatch({ type: ActionNameType.Login, payload: res.data.userInfo });
                let returnUrl: string = "/";
                if (router.query.returnUrl !== undefined && typeof router.query.returnUrl === "string") {
                    returnUrl = router.query.returnUrl;
                }
                router.push(returnUrl);
            })
            .catch((err) => {
                enqueueSnackbar(err, { variant: "error" });
                setLoading(false);
            });
    };

    useEffect(() => {
        const valuesLength = Object.keys(values).length;
        const errorsLength = Object.keys(errors).length;
        if (valuesLength > 0 && errorsLength === 0) {
            setLoading(true);
            sendLoginReq(values);
        }
    }, [values, errors]);

    return (
        <Form setValues={setValues} setErrors={setErrors} fields={["username", "password"]}>
            <InputText name="username" error={errors.username} />
            <InputText name="password" error={errors.password} type="password" />
            <Button loading={loading}>Sign In</Button>
        </Form>
    );
}
