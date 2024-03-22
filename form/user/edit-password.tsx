"use client";
import React, { useState, useEffect } from "react";
import InputText from "@components/field/InputText";
import Form from "@components/util/Form";
import Button from "@components/field/Button";
import EditPasswordRequest from "@api/User/EditPassword";
import { useSnackbar } from "notistack";
import { Grid } from "@mui/material";
import { useRouter } from "next/router";

type ErrorsType = {
    currentPassword?: string | undefined;
    password?: string | undefined;
    confirmPassword?: string | undefined;
};

export default function EditPasswordForm(): React.JSX.Element {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const [values, setValues] = useState({});
    const [errors, setErrors] = useState<ErrorsType>({});
    const { enqueueSnackbar } = useSnackbar();

    const sendChangePasswordReq = async (data: object): Promise<void> => {
        return EditPasswordRequest(data)
            .then((res) => {
                enqueueSnackbar(res.success, { variant: "success" });
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
            sendChangePasswordReq(values);
        }
    }, [values, errors]);

    return (
        <Form setValues={setValues} setErrors={setErrors} fields={["currentPassword", "password", "confirmPassword"]}>
            <Grid item xs={12} container spacing={2} sx={{ marginTop: (theme) => theme.spacing(2) }}>
                <Grid item xs={12}>
                    <InputText name="currentPassword" label="Current Password" error={errors.currentPassword} type="password" />
                </Grid>
                <Grid item xs={12}>
                    <InputText name="password" label="New Password" error={errors.password} type="password" />
                </Grid>
                <Grid item xs={12}>
                    <InputText name="confirmPassword" label="Confirm new Password" error={errors.confirmPassword} type="password" />
                </Grid>
                <Grid item xs={12}>
                    <Button loading={loading}>Change password</Button>
                </Grid>
            </Grid>
        </Form>
    );
}
