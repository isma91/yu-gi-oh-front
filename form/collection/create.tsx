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
import { AddApiBaseUrl, GetDefaultCardPicturePath } from "@utils/Url";
import { TransformCardCollectionToValuesRequest } from "@utils/Collection";
import CollectionCreateRequest from "@api/Collection/Create";
import { CollectionRouteName, GetFullRoute } from "@routes/Collection";

type ErrorsType = {
    [key in string]: string | undefined;
};

type ValuesType = {
    [key: string]: any;
};

type CollectionCreateForm = {
    cardCollection: CollectionInfoType[];
};

export default function CollectionCreateForm(props: CollectionCreateForm) {
    const { cardCollection } = props;
    const { enqueueSnackbar } = useSnackbar();
    const router = useRouter();
    const [values, setValues] = useState<ValuesType>({});
    const [errors, setErrors] = useState<ErrorsType>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [selectCollectionArtworkArray, setSelectCollectionArtworkArray] = useState<SelectDeckArtworkType[]>([]);

    useEffect(() => {
        let newSelectCollectionArtworkJson: { [key in number]: SelectDeckArtworkType } = {};
        for (let i = 0; i < cardCollection.length; i++) {
            const { name, pictures } = cardCollection[i].card;
            for (let j = 0; j < pictures.length; j++) {
                const { id, artworkUrl } = pictures[j];
                let url: string;
                if (artworkUrl !== null) {
                    url = AddApiBaseUrl(artworkUrl);
                } else {
                    url = GetDefaultCardPicturePath();
                }
                if (newSelectCollectionArtworkJson[id] !== undefined) {
                    continue;
                }
                newSelectCollectionArtworkJson[id] = { id: id, name: `${name} [n°${j + 1}]`, url: url };
            }
        }
        setSelectCollectionArtworkArray(Object.values(newSelectCollectionArtworkJson));
    }, [cardCollection]);

    const sendCollectionCreateReq = async (data: object) => {
        return CollectionCreateRequest(data)
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
            sendCollectionCreateReq(newValues);
        }
    }, [values, errors]);

    return (
        <Form setValues={setValues} setErrors={setErrors} fields={["name", "isPublic", "autocomplete_artwork"]}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <InputText name="name" error={errors.name} />
                </Grid>
                <Grid item xs={12}>
                    <Switch name="isPublic" label="Is your Collection going to be public ?" error={errors.isPublic} isOnOff />
                </Grid>
                <Grid item xs={12}>
                    <AutocompleteDeckArtwork error={errors.artwork} options={selectCollectionArtworkArray} />
                </Grid>
                <Grid item xs={12}>
                    <Button loading={loading}>Create Collection</Button>
                </Grid>
            </Grid>
        </Form>
    );
}
