import { useEffect, useState } from "react";
import { CollectionGetFromFilterFromCurrentUserType } from "@app/types/entity/Collection";
import Form from "@components/util/Form";
import { Grid } from "@mui/material";
import { useSnackbar } from "notistack";
import InputText from "@components/field/InputText";
import Button from "@components/field/Button";
import CollectionListFromCurrentUserRequest from "@api/Search/CollectionFromCurrentUser";

type CollectionSearchCurrentUserFormPropsType = {
    offsetState: [number, React.Dispatch<React.SetStateAction<number>>];
    loadingFormState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
    setCollectionAllResultCount: React.Dispatch<React.SetStateAction<number>>;
    setCollectionResult: React.Dispatch<React.SetStateAction<CollectionGetFromFilterFromCurrentUserType[]>>;
    searchLimit: React.JSX.Element;
    limit: number;
};

type ErrorsType = {
    [key in string]: string | undefined;
};

type ValuesType = {
    limit?: number;
    offset?: number;
    [key: string]: any;
};

export default function CollectionSearchCurrentUserForm(props: CollectionSearchCurrentUserFormPropsType) {
    const { setCollectionAllResultCount, setCollectionResult, searchLimit, limit } = props;
    const { enqueueSnackbar } = useSnackbar();
    const [offset, setOffset] = props.offsetState;
    const [loadingForm, setLoadingForm] = props.loadingFormState;
    const [values, setValues] = useState<ValuesType>({});
    const [errors, setErrors] = useState<ErrorsType>({});

    const sendCollectionSearchReq = async (data: object): Promise<void> => {
        return CollectionListFromCurrentUserRequest(data)
            .then((res) => {
                setCollectionAllResultCount(res.data.collectionAllResultCount);
                setCollectionResult(res.data.collection);
            })
            .catch((err) => {
                enqueueSnackbar(err, { variant: "error" });
            })
            .finally(() => {
                setLoadingForm(false);
            });
    };

    const launchSendCollectionSearchReq = (resetOffset: boolean = true) => {
        setLoadingForm(true);
        if (resetOffset === true) {
            setOffset(0);
        }
        const newValues = { ...values, offset: offset, limit: limit };
        setLoadingForm(false);
        sendCollectionSearchReq(newValues);
    };

    useEffect(() => {
        const valuesLength = Object.keys(values).length;
        const errorsLength = Object.keys(errors).length;
        if (valuesLength > 0 && errorsLength === 0) {
            launchSendCollectionSearchReq();
        }
    }, [values, errors]);

    useEffect(() => {
        launchSendCollectionSearchReq();
    }, [limit]);

    useEffect(() => {
        launchSendCollectionSearchReq(false);
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
                    <Button loading={loadingForm}>Search Collection</Button>
                </Grid>
            </Grid>
        </Form>
    );
}
