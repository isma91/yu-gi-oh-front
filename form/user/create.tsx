"use client";
import React, { useState, useEffect } from "react";
import InputText from "@components/field/InputText";
import Form from "@components/util/Form";
import Button from "@components/field/Button";
import CreateUserRequest from "@api/User/Create";
import { useSnackbar } from "notistack";
import { Grid } from "@mui/material";
import { useRouter } from "next/router";
import { AdminRouteName, GetFullRoute } from "@routes/Admin";

type ErrorsType = {
    username?: string | undefined;
    password?: string | undefined;
    confirmPassword?: string | undefined;
};

export default function UserCraeteForm(): React.JSX.Element {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const [values, setValues] = useState({});
    const [errors, setErrors] = useState<ErrorsType>({});
    const { enqueueSnackbar } = useSnackbar();

    const createUserReq = async (data: object): Promise<void> => {
        return CreateUserRequest(data)
            .then((res) => {
                enqueueSnackbar(res.success, { variant: "success" });
                router.push(GetFullRoute(AdminRouteName.BASE));
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
            createUserReq(values);
        }
    }, [values, errors]);

    return (
        <Form setValues={setValues} setErrors={setErrors} fields={["username", "password", "confirmPassword"]}>
            <Grid item xs={12} container spacing={2} sx={{ marginTop: (theme) => theme.spacing(2) }}>
                <Grid item xs={12}>
                    <InputText name="username" label="Username" error={errors.username} />
                </Grid>
                <Grid item xs={12}>
                    <InputText name="password" label="New Password" error={errors.password} type="password" />
                </Grid>
                <Grid item xs={12}>
                    <InputText name="confirmPassword" label="Confirm new Password" error={errors.confirmPassword} type="password" />
                </Grid>
                <Grid item xs={12}>
                    <Button loading={loading}>Create User</Button>
                </Grid>
            </Grid>
        </Form>
    );
}
