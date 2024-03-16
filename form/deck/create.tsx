import { useState, useEffect } from "react";
import Form from "@components/util/Form";
import { makeStyles } from "@mui/styles";
import { Box, Grid, Theme } from "@mui/material";
import InputText from "@components/field/InputText";
import Switch from "@components/field/Switch";
import Button from "@components/field/Button";
import { SelectDeckArtowrkType } from "@app/types/Deck";
import Autocomplete from "@components/field/Autocomplete";

type ErrorsType = {
    [key in string]: string | undefined;
};

type ValuesType = {
    [key: string]: any;
};

type DeckCreateForm = {
    selectDeckArtowrkArray: SelectDeckArtowrkType[];
};

const useStyles = makeStyles((theme: Theme) => ({
    artwork: {
        height: "100%",
        width: "auto",
    },
}));

export default function DeckCreateForm(props: DeckCreateForm) {
    const { selectDeckArtowrkArray } = props;
    const classes = useStyles();
    const [values, setValues] = useState<ValuesType>({});
    const [errors, setErrors] = useState<ErrorsType>({});
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const valuesLength = Object.keys(values).length;
        const errorsLength = Object.keys(errors).length;
        if (valuesLength > 0 && errorsLength === 0) {
            console.log(values);
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
