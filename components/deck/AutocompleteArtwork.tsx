import { SelectDeckArtworkType } from "@app/types/Deck";
import Autocomplete from "@components/field/Autocomplete";
import { makeStyles } from "@mui/styles";
import { Box, Theme } from "@mui/material";
import Image from "next/image";

type AutocompleteDeckArtworkPropsType = {
    error?: string;
    options: SelectDeckArtworkType[];
    loadingDefaultValue?: boolean;
    defaultValue?: SelectDeckArtworkType | null;
};

const useStyles = makeStyles((theme: Theme) => ({
    artwork: {
        height: "100%",
        width: "auto",
    },
}));

export default function AutocompleteDeckArtwork(props: AutocompleteDeckArtworkPropsType) {
    const { options } = props;
    const classes = useStyles();
    let autocompleteProps: {
        loadingDefaultValue?: boolean;
        defaultValue?: SelectDeckArtworkType | null;
    } = {};
    if (props.defaultValue !== undefined && props.loadingDefaultValue !== undefined) {
        autocompleteProps.defaultValue = props.defaultValue;
        autocompleteProps.loadingDefaultValue = props.loadingDefaultValue;
    }

    const getRenderOption = (props: React.HTMLAttributes<HTMLLIElement>, option: SelectDeckArtworkType) => {
        return (
            <Box component="li" sx={{ height: "200px" }} {...props}>
                <Image width={0} height={0} sizes="100vw" src={option.url} className={classes.artwork} alt={`Artwork of card ${option.name}`} />
                {option.name}
            </Box>
        );
    };

    return (
        <Autocomplete
            name="autocomplete_artwork"
            label="Artwork"
            error={props.error}
            options={options}
            optionLabel="name"
            optionValue="id"
            renderOption={getRenderOption}
            loading={false}
            {...autocompleteProps}
            optional
        />
    );
}
