import { useCallback, useState, useContext, useEffect, useMemo } from "react";
import { Badge, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, MenuItem, Paper, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { StoreContext } from "@app/lib/state-provider";
import Form from "@components/util/Form";
import Image from "next/image";
import { CardSearchType } from "@app/types/entity/Card";
import { CountryGetAllType } from "@app/types/entity/Country";
import { RarityGetAllType } from "@app/types/entity/Rarity";
import { SetGetAllType } from "@app/types/entity/Set";
import { DateFormatTypeType } from "@app/types/Date";
import InputNumber from "@components/field/InputNumber";
import Button from "@components/field/Button";
import Autocomplete from "@components/field/Autocomplete";
import Select from "@components/field/Select";
import { GetFormat } from "@utils/Date";
import { AddApiBaseUrl, GetDefaultCardPicturePath } from "@utils/Url";
import { GetIndexArray } from "@utils/Parsing";
import { Capitalize } from "@utils/String";
import RemoveIcon from "@mui/icons-material/Remove";
import CountryGetAllRequest from "@api/Country/GetAll";
import { CardCollectionInfoType } from "@app/types/CardCollection";

type DisplayCollectionPropsType = {
    openDialogState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
    cardDialogInfoState: [CardSearchType | null, React.Dispatch<React.SetStateAction<CardSearchType | null>>];
    cardCollectionState: [CardCollectionInfoType[], React.Dispatch<React.SetStateAction<CardCollectionInfoType[]>>];
};

type ErrorsType = {
    [key in string]: string | undefined;
};

type ValuesType = {
    nbCopie?: string;
    country?: string;
    set?: string;
    rarity?: string;
    picture?: string;
    [key: string]: any;
};

type SetWithRarityType = SetGetAllType & {
    rarities: Array<RarityGetAllType | null>;
};

export default function DisplayCollection(props: DisplayCollectionPropsType) {
    const { enqueueSnackbar } = useSnackbar();
    const { state: globalState } = useContext(StoreContext);
    const [openCardDialog, setOpenCardDialog] = props.openDialogState;
    const [cardDialogInfo, setCardDialogInfo] = props.cardDialogInfoState;
    const [cardCollection, setCardCollection] = props.cardCollectionState;
    const [values, setValues] = useState<ValuesType>({});
    const [country, setCountry] = useState<CountryGetAllType[]>([]);
    const [loadingCountry, setLoadingCountry] = useState<boolean>(true);
    const [skipCountry, setSkipCountry] = useState<boolean>(false);
    const [errors, setErrors] = useState<ErrorsType>({});
    const [selectedSet, setSelectedSet] = useState<SetWithRarityType | null>(null);
    const handleCloseCardDialog = useCallback(() => {
        setOpenCardDialog(false);
        setSelectedSet(null);
    }, [setOpenCardDialog]);
    const cardInfoSetRarityArray: SetWithRarityType[] = useMemo(() => {
        if (cardDialogInfo === null) {
            return [];
        }
        const { cardSets } = cardDialogInfo;
        if (cardSets.length === 0) {
            return [];
        }
        let setInfoJson: {
            [key in number]: SetWithRarityType;
        } = {};
        for (let i = 0; i < cardSets.length; i++) {
            const el = cardSets[i];
            if (el.sets.length === 0) {
                continue;
            }
            let setCode = "Unknown";
            let setReleaseDate = "Unknown";
            const set = el.sets[0];
            const { id, releaseDate, code } = set;
            if (code !== null) {
                setCode = code;
            }
            if (releaseDate !== null && releaseDate !== "") {
                setReleaseDate = GetFormat(releaseDate, DateFormatTypeType.DATE);
            }
            const { rarities } = el;
            let rarityInfoJson: RarityGetAllType | null = null;
            if (rarities.length === 0) {
                continue;
            }
            rarityInfoJson = rarities[0];
            if (setInfoJson[id] === undefined) {
                setInfoJson[id] = {
                    ...set,
                    name: `[${setCode}][${setReleaseDate}] ${set.name}`,
                    code: setCode,
                    releaseDate: setReleaseDate,
                    rarities: [rarityInfoJson],
                };
            } else {
                setInfoJson[id].rarities.push({ ...rarityInfoJson });
            }
        }
        return Object.values(setInfoJson);
    }, [cardDialogInfo]);
    const cardInfoPictureArray: Array<{ id: number; url: string; cardName: string }> = useMemo(() => {
        if (cardDialogInfo === null) {
            return [];
        }
        const { pictures } = cardDialogInfo;
        let pictureArray: Array<{ id: number; url: string; cardName: string }> = [];
        pictures.forEach((picture) => {
            let pictureUrl: string;
            if (picture.pictureSmallUrl === null) {
                pictureUrl = GetDefaultCardPicturePath();
            } else {
                pictureUrl = AddApiBaseUrl(picture.pictureSmallUrl);
            }
            pictureArray.push({ id: picture.id, url: pictureUrl, cardName: cardDialogInfo.name });
        });
        return pictureArray;
    }, [cardDialogInfo]);
    const handleSetAutocomplete = useCallback(<T extends object>(e: React.SyntheticEvent<Element, Event>, v: T | T[] | null) => {
        if (v === null || v === undefined) {
            setSelectedSet(null);
        } else if (Array.isArray(v) === true) {
            const value = v[0] as SetWithRarityType;
            setSelectedSet(value);
        } else {
            const val = v as SetWithRarityType;
            setSelectedSet(val);
        }
    }, []);
    const transformValuesToCollectionCard = useCallback((): CardCollectionInfoType | null => {
        if (cardDialogInfo === null) {
            return null;
        }
        const defaultInfoJson = { id: 0, name: "Unknown" };

        let rarityInfo = { ...defaultInfoJson };
        let rarityId = 0;
        if (values.rarity !== undefined) {
            rarityId = parseInt(values.rarity, 10);
        }

        let setInfo = { ...defaultInfoJson };
        let setId = 0;
        let setWithRarity: SetWithRarityType | null = null;
        if (values.set !== undefined && values.set !== "" && values.set !== "0") {
            setId = parseInt(values.set, 10);
            const setWithRarityIndex = GetIndexArray<SetWithRarityType>(cardInfoSetRarityArray, "id", setId);
            if (setWithRarityIndex !== null) {
                setWithRarity = cardInfoSetRarityArray[setWithRarityIndex];
            }
        }

        if (setWithRarity !== null) {
            setInfo = { ...setInfo, id: setWithRarity.id, name: setWithRarity.name };
            const { rarities } = setWithRarity;
            for (let i = 0; i < rarities.length; i++) {
                const elRarity = rarities[i];
                if (elRarity !== null && elRarity.id === rarityId) {
                    rarityInfo = { ...rarityInfo, id: rarityId, name: elRarity.name };
                    break;
                }
            }
        }

        let nbCopie = 1;
        if (values.nbCopie !== undefined) {
            nbCopie = parseInt(values.nbCopie, 10);
        }

        let countryInfo = { ...defaultInfoJson };
        if (values.country !== undefined) {
            const countryId = parseInt(values.country, 10);
            const countryIndex = GetIndexArray<CountryGetAllType>(country, "id", countryId);
            if (countryIndex !== null) {
                countryInfo = { id: countryId, name: country[countryIndex].name };
            }
        }

        let pictureInfo = { id: 0, url: GetDefaultCardPicturePath() };
        let pictureId = 0;
        if (values.picture !== undefined) {
            pictureId = parseInt(values.picture, 10);
            for (let j = 0; j < cardDialogInfo.pictures.length; j++) {
                const elPicture = cardDialogInfo.pictures[j];
                if (elPicture.id === pictureId && elPicture.artworkUrl !== null) {
                    pictureInfo = { ...pictureInfo, id: pictureId, url: AddApiBaseUrl(elPicture.artworkUrl) };
                    break;
                }
            }
        }

        return {
            card: { ...cardDialogInfo },
            name: cardDialogInfo.name,
            nbCopie: nbCopie,
            country: countryInfo,
            set: setInfo,
            rarity: rarityInfo,
            picture: pictureInfo,
        };
    }, [values, cardDialogInfo]);

    useEffect(() => {
        if (globalState.user !== null && skipCountry === false) {
            CountryGetAllRequest()
                .then((res) => setCountry(res.data.country))
                .catch((err) => enqueueSnackbar(err, { variant: "error" }))
                .finally(() => {
                    setLoadingCountry(false);
                    setSkipCountry(true);
                });
        }
    }, [globalState, skipCountry, loadingCountry]);

    useEffect(() => {
        const valuesLength = Object.keys(values).length;
        const errorsLength = Object.keys(errors).length;
        if (valuesLength > 0 && errorsLength === 0) {
            const newValues = transformValuesToCollectionCard();
            if (newValues === null) {
                enqueueSnackbar("Error while trying to add Card to Collection", { variant: "error" });
            } else {
                setCardCollection((prevState) => {
                    let newCardCollection = [...prevState];
                    newCardCollection.push({ ...newValues });
                    return newCardCollection;
                });
            }
            handleCloseCardDialog();
            setValues({});
            setCardDialogInfo(null);
        }
    }, [values, errors, transformValuesToCollectionCard, enqueueSnackbar, handleCloseCardDialog, setCardDialogInfo]);

    const displayDialog = (): React.JSX.Element => {
        return (
            <Dialog open={openCardDialog} onClose={handleCloseCardDialog}>
                <DialogTitle>Add Card to the Collection</DialogTitle>
                <Form
                    setErrors={setErrors}
                    setValues={setValues}
                    fields={["cardField", "nbCopie", "autocomplete_country", "autocomplete_set", "rarity", "picture"]}
                >
                    <DialogContent>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <DialogContentText>Please specify the Set, Language, Artwork and Number of Copie</DialogContentText>
                            </Grid>
                            <Grid item xs={12}>
                                <InputNumber name="nbCopie" label="Quantity of the Card" min={1} error={errors.nbCopie} isPositif={true} />
                            </Grid>
                            <Grid item xs={12}>
                                <Autocomplete
                                    name="autocomplete_country"
                                    label="Country"
                                    error={errors.country}
                                    options={country}
                                    optionLabel="name"
                                    optionValue="id"
                                    loading={loadingCountry}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Autocomplete
                                    name="autocomplete_set"
                                    label="Set"
                                    error={errors.set}
                                    options={cardInfoSetRarityArray}
                                    optionLabel="name"
                                    optionValue="id"
                                    loading={false}
                                    onChange={handleSetAutocomplete}
                                    optional
                                />
                            </Grid>
                            {selectedSet !== null ? (
                                <Grid item xs={12}>
                                    <Select name="rarity" error={errors.rarity} loading={false} optional>
                                        <MenuItem key={`displayCollection-${selectedSet.name}-rarity-none--1`}>
                                            <em>empty</em>
                                        </MenuItem>
                                        {selectedSet.rarities.map((rarity, rarityKey) => {
                                            if (rarity === null) {
                                                return null;
                                            }
                                            return (
                                                <MenuItem
                                                    key={`displayCollection-${selectedSet.name}-rarity-${rarity.slugName}-${rarityKey}`}
                                                    value={rarity.id}
                                                >
                                                    {rarity.name}
                                                </MenuItem>
                                            );
                                        })}
                                    </Select>
                                </Grid>
                            ) : null}
                            <Grid item xs={12}>
                                <Select name="picture" label="Artwork" error={errors.picture} loading={false}>
                                    <MenuItem key={`displayCollection-0--1`} value={0}>
                                        <em>empty</em>
                                    </MenuItem>
                                    {cardInfoPictureArray.map((cardInfoPicture, cardInfoPictureKey) => {
                                        return (
                                            <MenuItem
                                                key={`displayCollection-${cardInfoPicture.id}-${cardInfoPictureKey}`}
                                                value={cardInfoPicture.id}
                                            >
                                                <Image
                                                    style={{ height: "150px", width: "auto" }}
                                                    src={cardInfoPicture.url}
                                                    width={0}
                                                    height={0}
                                                    sizes="100vw"
                                                    alt={`Artwork n°${cardInfoPictureKey} with id ${cardInfoPicture.id} for card ${cardInfoPicture.cardName}`}
                                                />
                                            </MenuItem>
                                        );
                                    })}
                                </Select>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button loading={false} type="button" onClick={handleCloseCardDialog}>
                            Cancel
                        </Button>
                        <Button loading={false}>Add Card to the Collection</Button>
                    </DialogActions>
                </Form>
            </Dialog>
        );
    };

    return (
        <>
            {displayDialog()}
            <Grid item xs={12} container spacing={2} sx={{ marginTop: (theme) => theme.spacing(2) }}>
                {cardCollection.map((cardCollectionInfo, cardCollectionIndex) => {
                    const { name, card, nbCopie, set, country, rarity, picture } = cardCollectionInfo;
                    const cardCollectionBasicInfoArray = [
                        { name: "set", info: set },
                        { name: "country", info: country },
                        { name: "rarity", info: rarity },
                    ];
                    const gridKey = `cardCollectionInfo-${card.slugName}-${cardCollectionIndex}`;
                    return (
                        <Grid key={gridKey} container spacing={0} item xs={12}>
                            <Badge
                                sx={{ width: "100%" }}
                                color="error"
                                overlap="rectangular"
                                anchorOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                }}
                                badgeContent={
                                    <RemoveIcon
                                        sx={{ cursor: "pointer" }}
                                        onClick={() => {
                                            if (cardCollection[cardCollectionIndex] !== undefined) {
                                                setCardCollection((prevState) => {
                                                    let newCardCollection = [...prevState];
                                                    newCardCollection.splice(cardCollectionIndex, 1);
                                                    return newCardCollection;
                                                });
                                            }
                                        }}
                                    />
                                }
                            >
                                <Paper
                                    elevation={1}
                                    sx={{ width: "100%", padding: (theme) => theme.spacing(1), paddingTop: (theme) => theme.spacing(2) }}
                                >
                                    <Grid item xs={12}>
                                        <Typography
                                            component="p"
                                            sx={{ fontSize: "1.2rem", fontWeight: "bolder" }}
                                        >{`${name} x${nbCopie}`}</Typography>
                                    </Grid>
                                    {cardCollectionBasicInfoArray.map((cardCollectionBasicInfo) => {
                                        return (
                                            <Grid item xs={12} key={`${gridKey}-${cardCollectionBasicInfo.name}`}>
                                                <Typography component="p">
                                                    <span style={{ fontWeight: "bolder" }}>{`${Capitalize(cardCollectionBasicInfo.name)}:`}</span>
                                                    <span>{` ${cardCollectionBasicInfo.info.name}`}</span>
                                                </Typography>
                                            </Grid>
                                        );
                                    })}
                                    <Grid item xs={12}>
                                        <Image
                                            src={picture.url}
                                            width={0}
                                            height={0}
                                            sizes="100vw"
                                            style={{ height: "100px", width: "auto" }}
                                            alt={`Card ${name} artwork`}
                                        />
                                    </Grid>
                                </Paper>
                            </Badge>
                        </Grid>
                    );
                })}
            </Grid>
        </>
    );
}
