import { useEffect, useState, useContext } from "react";
import { DeckGetAllFromCurrentUserType } from "@app/types/entity/Deck";
import Form from "@components/util/Form";
import { StoreContext } from "@app/lib/state-provider";
import { Grid } from "@mui/material";
import { useSnackbar } from "notistack";
import InputText from "@components/field/InputText";
import Button from "@components/field/Button";
import DeckListFromCurrentUserRequest from "@api/Search/ListFromCurrentUser";

type DeckSearchCurrentUserFormPropsType = {
    offsetState: [number, React.Dispatch<React.SetStateAction<number>>];
    loadingFormState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
    setDeckAllResultCount: React.Dispatch<React.SetStateAction<number>>;
    setDeckResult: React.Dispatch<React.SetStateAction<DeckGetAllFromCurrentUserType[]>>;
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

export default function DeckSearchCurrentUserForm(props: DeckSearchCurrentUserFormPropsType) {
    const { setDeckAllResultCount, setDeckResult, searchLimit, limit } = props;
    const { state: globalState } = useContext(StoreContext);
    const { enqueueSnackbar } = useSnackbar();
    const [offset, setOffset] = props.offsetState;
    const [loadingForm, setLoadingForm] = props.loadingFormState;
    const [values, setValues] = useState<ValuesType>({});
    const [errors, setErrors] = useState<ErrorsType>({});

    const sendDeckSearchReq = async (data: object): Promise<void> => {
        return DeckListFromCurrentUserRequest(data)
            .then((res) => {
                setDeckAllResultCount(res.data.deckAllResultCount);
                setDeckResult(res.data.deck);
            })
            .catch((err) => {
                enqueueSnackbar(err, { variant: "error" });
            })
            .finally(() => {
                setLoadingForm(false);
            });
    };

    const launchSendDeckSearchReq = (resetOffset: boolean = true) => {
        setLoadingForm(true);
        if (resetOffset === true) {
            setOffset(0);
        }
        const newValues = { ...values, offset: offset, limit: limit };
        setLoadingForm(false);
        sendDeckSearchReq(newValues);
    };

    useEffect(() => {
        const valuesLength = Object.keys(values).length;
        const errorsLength = Object.keys(errors).length;
        if (valuesLength > 0 && errorsLength === 0) {
            launchSendDeckSearchReq();
        }
    }, [values, errors]);

    useEffect(() => {
        launchSendDeckSearchReq();
    }, [limit]);

    useEffect(() => {
        launchSendDeckSearchReq(false);
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
                    <Button loading={loadingForm}>Search Deck</Button>
                </Grid>
            </Grid>
        </Form>
    );
}
