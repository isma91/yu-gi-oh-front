import { useState, useEffect } from "react";
import Form from "@components/util/Form";
import { Grid } from "@mui/material";
import InputText from "@components/field/InputText";
import Switch from "@components/field/Switch";
import Button from "@components/field/Button";
import { DeckCardType, SelectDeckArtworkType } from "@app/types/Deck";
import DeckEditFromIdRequest from "@api/Deck/Edit";
import { useSnackbar } from "notistack";
import { useRouter } from "next/router";
import { DeckRouteName, GetFullRoute } from "@routes/Deck";
import { DeckGetInfoType } from "@app/types/entity/Deck";
import { GetSelectDeckArtworkFromDeckCard, TransformDeckCardToValueRequest } from "@utils/DeckCard";
import AutocompleteDeckArtwork from "@components/deck/AutocompleteArtwork";

type ErrorsType = {
    [key in string]: string | undefined;
};

type ValuesType = {
    [key: string]: any;
};

type DeckEditForm = {
    deckCard: DeckCardType;
    deckInfo: DeckGetInfoType;
};

export default function DeckEditForm(props: DeckEditForm) {
    const { deckCard, deckInfo } = props;
    const { enqueueSnackbar } = useSnackbar();
    const router = useRouter();
    const [values, setValues] = useState<ValuesType>({});
    const [errors, setErrors] = useState<ErrorsType>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [deckArtworkDefaultValue, setDeckArtworkDefaultValue] = useState<SelectDeckArtworkType | null>(null);
    const [loadingDefaultValueSelectDeckArtwork, setLoadingDefaultValueSelectDeckArtwork] = useState<boolean>(true);
    const [selectDeckArtworkArray, setSelectDeckArtworkArray] = useState<SelectDeckArtworkType[]>([]);

    useEffect(() => {
        const newSelectDeckArtworkArray = GetSelectDeckArtworkFromDeckCard(deckCard);
        setSelectDeckArtworkArray(newSelectDeckArtworkArray);
        if (newSelectDeckArtworkArray.length !== 0 && deckInfo.artworkCardId !== null) {
            let newDeckArtworkDefaultValue: SelectDeckArtworkType | null = null;
            for (let i = 0; i < newSelectDeckArtworkArray.length; i++) {
                const el = newSelectDeckArtworkArray[i];
                if (deckInfo.artworkCardId === el.id) {
                    newDeckArtworkDefaultValue = { ...el };
                    break;
                }
            }
            if (newDeckArtworkDefaultValue !== null) {
                setDeckArtworkDefaultValue(newDeckArtworkDefaultValue);
            }
            setLoadingDefaultValueSelectDeckArtwork(false);
        }
    }, [props]);

    const sendDeckEditReq = async (id: number, data: object) => {
        return DeckEditFromIdRequest(id, data)
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
            sendDeckEditReq(deckInfo.id, newValues);
        }
    }, [values, errors]);

    return (
        <Form setValues={setValues} setErrors={setErrors} fields={["name", "autocomplete_artwork", "isPublic", "tag"]}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <InputText name="name" error={errors.name} defaultValue={deckInfo.name} />
                </Grid>
                <Grid item xs={12}>
                    <Switch
                        name="isPublic"
                        label="Is your Deck going to be public ?"
                        defaultValue={deckInfo.isPublic}
                        error={errors.isPublic}
                        isOnOff
                    />
                </Grid>
                <Grid item xs={12}>
                    <AutocompleteDeckArtwork
                        error={errors.artwork}
                        options={selectDeckArtworkArray}
                        loadingDefaultValue={loadingDefaultValueSelectDeckArtwork}
                        defaultValue={deckArtworkDefaultValue}
                    />
                </Grid>
                <Grid item xs={12}>
                    Tags Selection
                </Grid>
                <Grid item xs={12}>
                    <Button loading={loading}>Edit Deck</Button>
                </Grid>
            </Grid>
        </Form>
    );
}
