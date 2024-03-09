"use client";
import React, { useState, useEffect, useContext } from "react";
import { Grid } from "@mui/material";
import Form from "@components/util/Form";
import InputText from "@components/field/InputText";
import Button from "@components/field/Button";
import CardSearchRequest from "@api/Search/Card";
import { StoreContext } from "@app/lib/state-provider";
import { useSnackbar } from "notistack";
import { useRouter } from "next/router";
import { CardSearchType } from "@app/types/entity/Card";

type CardSearchFormPropsType = {
    offsetState: [number, React.Dispatch<React.SetStateAction<number>>];
    loadingFormState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
    setCardAllResultCount: React.Dispatch<React.SetStateAction<number>>;
    setCardResult: React.Dispatch<React.SetStateAction<CardSearchType[]>>;
    searchLimit: React.JSX.Element;
    limit: number;
};

type ErrorsType = {
    name?: string;
    limit?: string;
};

type ValuesType = {
    limit?: number;
    offset?: number;
    [key: string]: any;
};

export default function CardSearchForm(props: CardSearchFormPropsType): React.JSX.Element {
    const { setCardAllResultCount, setCardResult, searchLimit, limit } = props;
    const router = useRouter();
    const { dispatch } = useContext(StoreContext);
    const [offset, setOffset] = props.offsetState;
    const [loadingForm, setLoadingForm] = props.loadingFormState;
    const [values, setValues] = useState<ValuesType>({});
    const [errors, setErrors] = useState<ErrorsType>({});
    const { enqueueSnackbar } = useSnackbar();

    const sendCardSearchReq = async (data: object): Promise<void> => {
        return CardSearchRequest(data)
            .then((res) => {
                setCardAllResultCount(res.data.cardAllResultCount);
                setCardResult(res.data.card);
            })
            .catch((err) => {
                enqueueSnackbar(err, { variant: "error" });
            })
            .finally(() => {
                setLoadingForm(false);
            });
    };

    const fullfilValuesBeforeSendReq = (): ValuesType => {
        return { ...values, offset: offset, limit: limit };
    };

    const launchSendCardSearchReq = (resetOffset: boolean = true) => {
        setLoadingForm(true);
        if (resetOffset === true) {
            setOffset(0);
        }
        const newValues = fullfilValuesBeforeSendReq();
        sendCardSearchReq(newValues);
    };

    useEffect(() => {
        const valuesLength = Object.keys(values).length;
        const errorsLength = Object.keys(errors).length;
        if (valuesLength > 0 && errorsLength === 0) {
            launchSendCardSearchReq();
        }
    }, [values, errors]);

    useEffect(() => {
        launchSendCardSearchReq();
    }, [limit]);

    useEffect(() => {
        launchSendCardSearchReq(false);
    }, [offset]);

    return (
        <Form setValues={setValues} setErrors={setErrors} fields={["name"]}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <InputText name="name" error={errors.name} optional />
                </Grid>
                <Grid item xs={12}>
                    {searchLimit}
                </Grid>
                <Grid item xs={12}>
                    Filter component
                </Grid>
                <Grid item xs={12}>
                    <Button loading={loadingForm}>Search Card</Button>
                </Grid>
            </Grid>
        </Form>
    );
}
