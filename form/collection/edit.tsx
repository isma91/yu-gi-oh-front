import { useState, useEffect } from "react";
import Form from "@components/util/Form";
import { Grid } from "@mui/material";
import InputText from "@components/field/InputText";
import Switch from "@components/field/Switch";
import Button from "@components/field/Button";
import { SelectDeckArtworkType } from "@app/types/Deck";
import { useSnackbar } from "notistack";
import { useRouter } from "next/router";
import AutocompleteDeckArtwork from "@components/deck/AutocompleteArtwork";
import { CollectionInfoType } from "@app/types/Collection";
import { GetSelectCollectionArtworkFromCollectionInfo, TransformCardCollectionToValuesRequest } from "@utils/Collection";
import CollectionEditRequest from "@api/Collection/Edit";
import { CollectionRouteName, GetFullRoute } from "@routes/Collection";
import { CollectionGetInfoType } from "@app/types/entity/Collection";

type ErrorsType = {
    [key in string]: string | undefined;
};

type ValuesType = {
    [key: string]: any;
};

type CollectionEditForm = {
    cardCollection: CollectionInfoType[];
    cardCollectionInfo: CollectionGetInfoType;
};

export default function CollectionEditForm(props: CollectionEditForm) {
    const { cardCollection, cardCollectionInfo } = props;
    const { enqueueSnackbar } = useSnackbar();
    const router = useRouter();
    const [values, setValues] = useState<ValuesType>({});
    const [errors, setErrors] = useState<ErrorsType>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [collectionArtworkDefaultValue, setCollectionArtworkDefaultValue] = useState<SelectDeckArtworkType | null>(null);
    const [loadingDefaultValueSelectCollectionArtwork, setLoadingDefaultValueSelectCollectionArtwork] = useState<boolean>(true);
    const [selectCollectionArtworkArray, setSelectCollectionArtworkArray] = useState<SelectDeckArtworkType[]>([]);

    useEffect(() => {
        const newSelectCollectionArtworkArray = GetSelectCollectionArtworkFromCollectionInfo(cardCollection);
        setSelectCollectionArtworkArray(newSelectCollectionArtworkArray);
        if (newSelectCollectionArtworkArray.length !== 0 && cardCollectionInfo.artworkId !== null) {
            let newCollectionArtworkDefaultValue: SelectDeckArtworkType | null = null;
            for (let i = 0; i < newSelectCollectionArtworkArray.length; i++) {
                const el = newSelectCollectionArtworkArray[i];
                if (cardCollectionInfo.artworkId === el.id) {
                    newCollectionArtworkDefaultValue = { ...el };
                    break;
                }
            }
            if (newCollectionArtworkDefaultValue !== null) {
                setCollectionArtworkDefaultValue(newCollectionArtworkDefaultValue);
            }
            setLoadingDefaultValueSelectCollectionArtwork(false);
        }
    }, [props]);

    const sendCollectionEditReq = async (data: object) => {
        return CollectionEditRequest(cardCollectionInfo.id, data)
            .then((res) => {
                enqueueSnackbar(res.success, { variant: "success" });
                router.push(GetFullRoute(CollectionRouteName.LIST));
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
            const newValues = TransformCardCollectionToValuesRequest(cardCollection, values);
            sendCollectionEditReq(newValues);
        }
    }, [values, errors]);

    return (
        <Form setValues={setValues} setErrors={setErrors} fields={["name", "isPublic", "autocomplete_artwork"]}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <InputText name="name" error={errors.name} defaultValue={cardCollectionInfo.name} />
                </Grid>
                <Grid item xs={12}>
                    <Switch
                        name="isPublic"
                        label="Is your Collection going to be public ?"
                        error={errors.isPublic}
                        isOnOff
                        defaultValue={cardCollectionInfo.isPublic}
                    />
                </Grid>
                <Grid item xs={12}>
                    <AutocompleteDeckArtwork
                        error={errors.artwork}
                        options={selectCollectionArtworkArray}
                        loadingDefaultValue={loadingDefaultValueSelectCollectionArtwork}
                        defaultValue={collectionArtworkDefaultValue}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button loading={loading}>Edit Collection</Button>
                </Grid>
            </Grid>
        </Form>
    );
}
