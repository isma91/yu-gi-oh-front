"use client";
import React, { useState, useEffect, useContext } from "react";
import { StoreContext } from "@app/lib/state-provider";
import InputText from "@components/field/InputText";
import Form from "@components/util/Form";
import Button from "@components/field/Button";
import EditUsernameRequest from "@api/User/EditUsername";
import { useSnackbar } from "notistack";
import { Grid } from "@mui/material";
import { useRouter } from "next/router";
import { ActionNameType } from "@app/types/GlobalState";

type ErrorsType = {
    username?: string | undefined;
};

type valuesType = {
    username?: string;
};

export default function EditUsernameForm(): React.JSX.Element {
    const router = useRouter();
    const { dispatch } = useContext(StoreContext);
    const [loading, setLoading] = useState<boolean>(false);
    const [values, setValues] = useState<valuesType>({});
    const [errors, setErrors] = useState<ErrorsType>({});
    const { enqueueSnackbar } = useSnackbar();

    const sendChangeUsernameReq = async (username: string): Promise<void> => {
        return EditUsernameRequest(username)
            .then((res) => {
                enqueueSnackbar(res.success, { variant: "success" });
                dispatch({ type: ActionNameType.Logout, payload: null });
                router.push("/");
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
            const { username } = values;
            if (username !== undefined) {
                if (username.length < 3) {
                    setErrors((prevState) => {
                        let newErrors = { ...prevState };
                        newErrors.username = "Your username must be at least 3 characters long !!";
                        return newErrors;
                    });
                } else {
                    sendChangeUsernameReq(username);
                }
            }
        }
    }, [values, errors]);

    return (
        <Form setValues={setValues} setErrors={setErrors} fields={["username"]}>
            <Grid item xs={12} container spacing={2} sx={{ marginTop: (theme) => theme.spacing(2) }}>
                <Grid item xs={12}>
                    <InputText name="username" label="New Username" error={errors.username} />
                </Grid>
                <Grid item xs={12}>
                    <Button loading={loading}>Change Username</Button>
                </Grid>
            </Grid>
        </Form>
    );
}
