import { useState, useEffect } from "react";
import Button from "@components/field/Button";
import InputNumber from "@components/field/InputNumber";
import InputText from "@components/field/InputText";
import Form from "@components/util/Form";
import { Grid } from "@mui/material";
import SearchSetRequest from "@api/Search/Set";
import { SetSearchType } from "@app/types/entity/Set";
import { useSnackbar } from "notistack";

type ErrorsType = {
    [key in string]?: string;
};

type SetSearchFormPropsType = {
    offsetState: [number, React.Dispatch<React.SetStateAction<number>>];
    loadingFormState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
    setSetAllResultCount: React.Dispatch<React.SetStateAction<number>>;
    setSetResult: React.Dispatch<React.SetStateAction<SetSearchType[]>>;
    searchLimit: React.JSX.Element;
    limit: number;
};

export default function SetSearchForm(props: SetSearchFormPropsType) {
    const { setSetAllResultCount, setSetResult, limit } = props;
    const [offset, setOffset] = props.offsetState;
    const [loadingForm, setLoadingForm] = props.loadingFormState;
    const { enqueueSnackbar } = useSnackbar();
    const [values, setValues] = useState({});
    const [errors, setErrors] = useState<ErrorsType>({});

    const sendSearchSetReq = async (data: object) => {
        return SearchSetRequest(data)
            .then((res) => {
                setSetAllResultCount(res.data.setAllResultCount);
                setSetResult(res.data.set);
            })
            .catch((err) => {
                enqueueSnackbar(err, { variant: "error" });
            })
            .finally(() => {
                setLoadingForm(false);
            });
    };

    const launchSendSetSearchReq = (resetOffset: boolean = true) => {
        setLoadingForm(true);
        if (resetOffset === true) {
            setOffset(0);
        }
        const newValues = { ...values, offset: offset, limit: limit };
        setLoadingForm(false);
        sendSearchSetReq(newValues);
    };

    useEffect(() => {
        const valuesLength = Object.keys(values).length;
        const errorsLength = Object.keys(errors).length;
        if (valuesLength > 0 && errorsLength === 0) {
            launchSendSetSearchReq();
        }
    }, [values, errors]);

    useEffect(() => {
        launchSendSetSearchReq();
    }, [limit]);

    useEffect(() => {
        launchSendSetSearchReq(false);
    }, [offset]);

    return (
        <Form setValues={setValues} setErrors={setErrors} fields={["name", "date", "code"]}>
            <Grid item xs={12} container spacing={2}>
                <Grid item xs={12}>
                    <InputText name="name" error={errors.name} optional />
                </Grid>
                <Grid item xs={12}>
                    <InputText name="code" error={errors.code} optional />
                </Grid>
                <Grid item xs={6}>
                    <InputNumber name="yearBegin" label="Release date From" error={errors.yearBegin} min={1900} max={2100} optional />
                </Grid>
                <Grid item xs={6}>
                    <InputNumber name="yearEnd" label="Release date To" error={errors.yearEnd} min={1900} max={2100} optional />
                </Grid>
                <Grid item xs={12}>
                    <Button loading={loadingForm}>Search Set</Button>
                </Grid>
            </Grid>
        </Form>
    );
}
