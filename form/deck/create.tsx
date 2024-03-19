import { useState, useEffect } from "react";
import Form from "@components/util/Form";
import { makeStyles } from "@mui/styles";
import { Box, Grid, Theme } from "@mui/material";
import InputText from "@components/field/InputText";
import Switch from "@components/field/Switch";
import Button from "@components/field/Button";
import { DeckCardFieldType, DeckCardType, SelectDeckArtowrkType } from "@app/types/Deck";
import Autocomplete from "@components/field/Autocomplete";
import DeckCreateRequest from "@api/Deck/Create";
import { useSnackbar } from "notistack";
import { useRouter } from "next/router";
import { DeckRouteName, GetFullRoute } from "@routes/Deck";

type ErrorsType = {
    [key in string]: string | undefined;
};

type ValuesType = {
    [key: string]: any;
};

type DeckCreateForm = {
    selectDeckArtowrkArray: SelectDeckArtowrkType[];
    deckCard: DeckCardType;
};

const useStyles = makeStyles((theme: Theme) => ({
    artwork: {
        height: "100%",
        width: "auto",
    },
}));

export default function DeckCreateForm(props: DeckCreateForm) {
    const { selectDeckArtowrkArray, deckCard } = props;
    const { enqueueSnackbar } = useSnackbar();
    const router = useRouter();
    const classes = useStyles();
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

    const transformValues = () => {
        const deckCardFieldTypeArray = Object.values(DeckCardFieldType);
        let deckCardUniqueJson: { [key in DeckCardFieldType]: { [key in number]: number } } = {
            [DeckCardFieldType.MAIN_DECK]: {},
            [DeckCardFieldType.EXTRA_DECK]: {},
            [DeckCardFieldType.SIDE_DECK]: {},
        };
        deckCardFieldTypeArray.forEach((cardFieldType) => {
            deckCard[cardFieldType].forEach((cardInfo) => {
                const { id: cardInfoId } = cardInfo;
                if (deckCardUniqueJson[cardFieldType][cardInfoId] === undefined) {
                    deckCardUniqueJson[cardFieldType][cardInfoId] = 1;
                } else {
                    deckCardUniqueJson[cardFieldType][cardInfoId] = deckCardUniqueJson[cardFieldType][cardInfoId] + 1;
                }
            });
        });
        let newDeckCardValues: { [key in string]: string } = {};
        deckCardFieldTypeArray.forEach((cardFieldType) => {
            Object.keys(deckCardUniqueJson[cardFieldType]).forEach((cardInfoIdString, index) => {
                const cardInfoId = parseInt(cardInfoIdString, 10);
                const nbCopie = deckCardUniqueJson[cardFieldType][cardInfoId];
                const newDeckCardValuesBaseKey = `[deck-card][${cardFieldType}][${index}]`;
                newDeckCardValues[`${newDeckCardValuesBaseKey}[id]`] = cardInfoId.toString(10);
                newDeckCardValues[`${newDeckCardValuesBaseKey}[nbCopie]`] = nbCopie.toString(10);
            });
        });
        return { ...values, ...newDeckCardValues };
    };

    useEffect(() => {
        const valuesLength = Object.keys(values).length;
        const errorsLength = Object.keys(errors).length;
        if (valuesLength > 0 && errorsLength === 0) {
            setLoading(true);
            const newValues = transformValues();
            sendDeckCreateReq(newValues);
        }
    }, [values, errors]);

    const getRenderOption = (props: React.HTMLAttributes<HTMLLIElement>, option: SelectDeckArtowrkType) => {
        return (
            <Box component="li" sx={{ height: "200px" }} {...props}>
                <img src={option.url} className={classes.artwork} alt="" />
                {option.name}
            </Box>
        );
    };

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
                    <Autocomplete
                        name="autocomplete_artwork"
                        label="Artwork"
                        error={errors.artwork}
                        options={selectDeckArtowrkArray}
                        optionLabel="name"
                        optionValue="id"
                        renderOption={getRenderOption}
                        loading={false}
                        optional
                    />
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
