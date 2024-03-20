import { useState, useEffect } from "react";
import Form from "@components/util/Form";
import { Grid } from "@mui/material";
import InputText from "@components/field/InputText";
import Switch from "@components/field/Switch";
import Button from "@components/field/Button";
import { DeckCardType, SelectDeckArtworkType } from "@app/types/Deck";
import DeckCreateRequest from "@api/Deck/Create";
import { useSnackbar } from "notistack";
import { useRouter } from "next/router";
import { DeckRouteName, GetFullRoute } from "@routes/Deck";
import { TransformDeckCardToValueRequest } from "@utils/DeckCard";
import AutocompleteDeckArtwork from "@components/deck/AutocompleteArtwork";

type ErrorsType = {
    [key in string]: string | undefined;
};

type ValuesType = {
    [key: string]: any;
};

type DeckCreateForm = {
    selectDeckArtworkArray: SelectDeckArtworkType[];
    deckCard: DeckCardType;
};

export default function DeckCreateForm(props: DeckCreateForm) {
    const { selectDeckArtworkArray, deckCard } = props;
    const { enqueueSnackbar } = useSnackbar();
    const router = useRouter();
    const [values, setValues] = useState<ValuesType>({});
    const [errors, setErrors] = useState<ErrorsType>({});
    const [loading, setLoading] = useState<boolean>(false);

    const sendDeckCreateReq = async (data: object) => {
        return DeckCreateRequest(data)
            .then((res) => {
                enqueueSnackbar(res.success, { variant: "success" });
                router.push(GetFullRoute(DeckRouteName.LIST));
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
            const newValues = TransformDeckCardToValueRequest(deckCard, values);
            sendDeckCreateReq(newValues);
        }
    }, [values, errors]);

    return (
        <Form setValues={setValues} setErrors={setErrors} fields={["name", "autocomplete_artwork", "isPublic", "tag"]}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <InputText name="name" error={errors.name} />
                </Grid>
                <Grid item xs={12}>
                    <Switch name="isPublic" label="Is your Deck giong to be public ?" error={errors.isPublic} isOnOff />
                </Grid>
                <Grid item xs={12}>
                    <AutocompleteDeckArtwork error={errors.artwork} options={selectDeckArtworkArray} />
                </Grid>
                <Grid item xs={12}>
                    Tags Selection
                </Grid>
                <Grid item xs={12}>
                    <Button loading={loading}>Create Deck</Button>
                </Grid>
            </Grid>
        </Form>
    );
}
