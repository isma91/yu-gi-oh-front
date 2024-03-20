import React, { useState, useEffect } from "react";
import DashboardHome from "@components/dashboard/Home";
import { useTheme, Grid, Dialog, DialogTitle, DialogContent, DialogContentText, MenuItem, DialogActions } from "@mui/material";
import { CardSearchType } from "@app/types/entity/Card";
import SearchLimitSelect from "@components/search/LimitSelect";
import CardSearchForm from "@form/card/search";
import SearchCardDisplay from "@components/search/CardDisplay";
import DeckCreateForm from "@form/deck/create";
import InputNumber from "@components/field/InputNumber";
import Select from "@components/field/Select";
import { Capitalize } from "@utils/String";
import Button from "@components/field/Button";
import { GetCardPictureUrl } from "@utils/SearchCard";
import SearchCardPopover from "@components/search/CardPopover";
import { CardInfoToDisplayType } from "@app/types/SearchCard";
import { ArrayIncludes, CreateArrayNumber } from "@utils/Array";
import Form from "@components/util/Form";
import { enqueueSnackbar } from "notistack";
import SortIcon from "@mui/icons-material/Sort";
import Alert from "@components/feedback/Alert";
import { IconPositionEnumType } from "@app/types/Input";
import { Sort as CardSort } from "@utils/CardSort";
import Switch from "@components/field/Switch";
import { SelectDeckArtowrkType, DeckCardFieldType, DeckCardType } from "@app/types/Deck";
import DisplayDeckCard from "@components/deck/DisplayCard";

type ErrorsType = {
    [key in string]: string | undefined;
};

type ValuesType = {
    cardField?: string | DeckCardFieldType;
    nbCopie?: string;
    [key: string]: any;
};

type NewValuesType = {
    fieldType: DeckCardFieldType;
    nbCopie: number;
    cardInfo: CardSearchType;
};

export default function DeckCreatePage() {
    const Theme = useTheme();
    const [values, setValues] = useState<ValuesType>({});
    const [errors, setErrors] = useState<ErrorsType>({});
    const [offset, setOffset] = useState<number>(0);
    const [limit, setLimit] = useState<number>(15);
    const [cardAllResultCount, setCardAllResultCount] = useState<number>(0);
    const [loadingForm, setLoadingForm] = useState<boolean>(false);
    const [cardResult, setCardResult] = useState<CardSearchType[]>([]);
    const limitArray: number[] = [15, 30, 45, 60];
    const [deckCard, setDeckCard] = useState<DeckCardType>({
        [DeckCardFieldType.MAIN_DECK]: [],
        [DeckCardFieldType.EXTRA_DECK]: [],
        [DeckCardFieldType.SIDE_DECK]: [],
    });
    const [openCardDialog, setOpenCardDialog] = useState<boolean>(false);
    const [cardDialogInfo, setCardDialogInfo] = useState<CardSearchType | null>(null);
    const [anchorEl, setAnchorEl] = useState<HTMLImageElement | null>(null);
    const [cardInfoToDisplay, setCardInfoToDisplay] = useState<CardInfoToDisplayType | null>(null);
    const [deckCardWarning, setDeckCardWarning] = useState<string | null>(null);
    const [autoClick, setAutoClick] = useState<boolean>(true);
    const [selectDeckArtowrkArray, setSelectDeckArtowrkArray] = useState<SelectDeckArtowrkType[]>([]);
    const openPopover = Boolean(anchorEl);
    const cardFieldTypeArray: DeckCardFieldType[] = Object.values(DeckCardFieldType);
    const subCategoryNotInExtraDeck = "ritual";
    const nbCopieMaxPerCard = parseInt(process.env["NEXT_PUBLIC_NB_SAME_CARD_DECK"] as string, 10);
    const nbCardMinMainDeck = parseInt(process.env["NEXT_PUBLIC_NB_MIN_CARD_MAIN_DECK"] as string, 10);
    const nbCardMaxMainDeck = parseInt(process.env["NEXT_PUBLIC_NB_MAX_CARD_MAIN_DECK"] as string, 10);
    const nbCardMaxExtraDeck = parseInt(process.env["NEXT_PUBLIC_NB_MAX_CARD_EXTRA_DECK"] as string, 10);
    const nbCardMaxSideDeck = parseInt(process.env["NEXT_PUBLIC_NB_MAX_CARD_SIDE_DECK"] as string, 10);

    useEffect(() => {
        if (autoClick === true && cardDialogInfo !== null) {
            handleValues({
                fieldType: findDeckFieldTypeFromCardInfo(cardDialogInfo),
                nbCopie: 1,
                cardInfo: cardDialogInfo,
            });
            setCardDialogInfo(null);
        }
    }, [cardDialogInfo]);

    useEffect(() => {
        const deckCardMainDeckArray = deckCard[DeckCardFieldType.MAIN_DECK];
        const deckCardMainDeckNumber = deckCardMainDeckArray.length;
        const deckCardExtraDeckArray = deckCard[DeckCardFieldType.EXTRA_DECK];
        const deckCardExtraDeckNumber = deckCardExtraDeckArray.length;
        const deckCardSideDeckArray = deckCard[DeckCardFieldType.SIDE_DECK];
        const deckCardSideDeckNumber = deckCardSideDeckArray.length;
        let newDeckCardWarning = null;
        if (deckCardMainDeckNumber > nbCardMaxMainDeck) {
            newDeckCardWarning = `The ${DeckCardFieldType.MAIN_DECK} have more than ${nbCardMaxMainDeck} cards !!`;
        } else if (deckCardMainDeckNumber < nbCardMinMainDeck) {
            newDeckCardWarning = `The ${DeckCardFieldType.MAIN_DECK} have less than ${nbCardMinMainDeck} cards !!`;
        } else if (deckCardExtraDeckNumber > nbCardMaxExtraDeck) {
            newDeckCardWarning = `The ${DeckCardFieldType.EXTRA_DECK} have more than ${nbCardMaxExtraDeck} cards !!`;
        } else if (deckCardSideDeckNumber > nbCardMaxSideDeck) {
            newDeckCardWarning = `The ${DeckCardFieldType.SIDE_DECK} have more than ${nbCardMaxSideDeck} cards !!`;
        }
        setDeckCardWarning(newDeckCardWarning);
        setSelectDeckArtowrkArray(getDeckCardUniqueWithIdAndUrl());
    }, [deckCard]);

    const getDeckCardUniqueWithIdAndUrl = (): SelectDeckArtowrkType[] => {
        let newDeckCardUniqueArray: SelectDeckArtowrkType[] = [];
        let newDeckCardUniqueJson: { [key in number]: { url: string; name: string } } = {};
        cardFieldTypeArray.forEach((cardFieldType) => {
            deckCard[cardFieldType].forEach((cardInfo) => {
                const { id, name } = cardInfo;
                newDeckCardUniqueJson[id] = { url: GetCardPictureUrl(cardInfo), name };
            });
        });
        Object.keys(newDeckCardUniqueJson).forEach((idString) => {
            const id = parseInt(idString, 10);
            const { url, name } = newDeckCardUniqueJson[id];
            newDeckCardUniqueArray.push({ id: id, url: url, name: name });
        });
        return newDeckCardUniqueArray;
    };

    const findDeckFieldTypeFromCardInfo = (cardInfo: CardSearchType): DeckCardFieldType => {
        const { subCategory: cardInfoSubCategory, category: cardInfoCategory } = cardInfo;
        if (cardInfoCategory.slugName !== "monster") {
            return DeckCardFieldType.MAIN_DECK;
        } else {
        }
        if (cardInfoSubCategory === null) {
            return DeckCardFieldType.MAIN_DECK;
        }
        if (cardInfoSubCategory.slugName.includes(subCategoryNotInExtraDeck) === true) {
            return DeckCardFieldType.MAIN_DECK;
        }
        return DeckCardFieldType.EXTRA_DECK;
    };

    const addCardInfoNbCopieTime = (cardInfo: CardSearchType, nbCopie: number): CardSearchType[] => {
        let array = [];
        const arrayNumber = CreateArrayNumber(1, nbCopie);
        for (let i = 0; i < arrayNumber.length; i++) {
            array.push(cardInfo);
        }
        return array;
    };

    const findCardInfoArrayfromDeckCardFieldTypeAndCardInfoId = (
        deckCardFieldTypeArray: CardSearchType[],
        cardInfoId: number
    ): Array<{ index: number; cardInfo: CardSearchType }> => {
        let newArray: Array<{ index: number; cardInfo: CardSearchType }> = [];
        for (let i = 0; i < deckCardFieldTypeArray.length; i++) {
            const el = deckCardFieldTypeArray[i];
            if (el.id === cardInfoId) {
                newArray.push({ index: i, cardInfo: el });
            }
        }
        return newArray;
    };

    const handleValues = (newValues: NewValuesType): boolean => {
        const { nbCopie, fieldType, cardInfo } = newValues;
        const { id: cardInfoId, subCategory: cardInfoSubCategory, category: cardInfoCategory } = cardInfo;
        let cardSubCategoryIsRitual = false;
        let cardSubCategoryIsMonster = false;
        if (cardInfoCategory.slugName === "monster") {
            cardSubCategoryIsMonster = true;
        }
        if (cardInfoSubCategory !== null) {
            const { slugName: cardInfoSubCategorySlugName } = cardInfoSubCategory;
            cardSubCategoryIsRitual = cardInfoSubCategorySlugName.includes(subCategoryNotInExtraDeck);
        }
        if (
            (cardSubCategoryIsMonster === false || cardSubCategoryIsRitual === true || cardInfoSubCategory === null) &&
            fieldType === DeckCardFieldType.EXTRA_DECK
        ) {
            enqueueSnackbar("This card can't be in Extra-Deck zone.", { variant: "error" });
            return false;
        }
        if (
            cardSubCategoryIsMonster === true &&
            cardSubCategoryIsRitual === false &&
            cardInfoSubCategory !== null &&
            fieldType === DeckCardFieldType.MAIN_DECK
        ) {
            enqueueSnackbar("This card can't be in Main-Deck zone.", { variant: "error" });
            return false;
        }
        let newDeckCard = { ...deckCard };
        const cardInfoWithIndexArrayInDeckCardFieldType = findCardInfoArrayfromDeckCardFieldTypeAndCardInfoId(deckCard[fieldType], cardInfoId);
        const oldNbCopie = cardInfoWithIndexArrayInDeckCardFieldType.length;
        let newDeckCardFieldTypeArray = newDeckCard[fieldType];
        if (oldNbCopie === 0) {
            newDeckCardFieldTypeArray = newDeckCardFieldTypeArray.concat(addCardInfoNbCopieTime(cardInfo, nbCopie));
        } else if (oldNbCopie === nbCopieMaxPerCard) {
            enqueueSnackbar(`You already have the maximum amount of copie for this card in the ${fieldType} zone.`, { variant: "warning" });
            return false;
        } else {
            let newNbCopie = oldNbCopie + nbCopie;
            if (newNbCopie > nbCopieMaxPerCard) {
                newNbCopie = nbCopieMaxPerCard;
            }
            const nbCopieToAdd = newNbCopie - oldNbCopie;
            newDeckCardFieldTypeArray = newDeckCardFieldTypeArray.concat(addCardInfoNbCopieTime(cardInfo, nbCopieToAdd));
        }
        newDeckCard[fieldType] = newDeckCardFieldTypeArray;
        setDeckCard(newDeckCard);
        setValues({});
        return false;
    };

    useEffect(() => {
        const valuesLength = Object.keys(values).length;
        const errorsLength = Object.keys(errors).length;
        if (valuesLength > 0 && errorsLength === 0) {
            handleCloseCardDialog();
            const newValues = transformCardDialogValues();
            if (newValues === null) {
                enqueueSnackbar("Error while trying to add Card to Deck.", { variant: "error" });
            } else {
                handleValues(newValues);
            }
        }
    }, [values, errors]);

    const handlePopoverClose = () => {
        setAnchorEl(null);
        setCardInfoToDisplay(null);
    };

    const removeCard = (index: number, fieldType: DeckCardFieldType) => {
        let deckCardFieldTypeArray = [...deckCard[fieldType]];
        deckCardFieldTypeArray.splice(index, 1);
        setDeckCard((prevState) => {
            let newDeckCard = { ...prevState };
            newDeckCard[fieldType].splice(index, 1);
            return newDeckCard;
        });
    };

    const transformCardDialogValues = (): NewValuesType | null => {
        let fieldType: DeckCardFieldType = DeckCardFieldType.MAIN_DECK;
        if (values.cardField !== undefined && ArrayIncludes(cardFieldTypeArray, values.cardField) === true) {
            fieldType = values.cardField as DeckCardFieldType;
        }
        let nbCopie = 0;
        if (values.nbCopie !== undefined) {
            const valuesNbCopie = parseInt(values.nbCopie, 10);
            if (Number.isNaN(valuesNbCopie) === false && valuesNbCopie > 0 && valuesNbCopie <= nbCopieMaxPerCard) {
                nbCopie = valuesNbCopie;
            }
        }
        if (cardDialogInfo !== null) {
            return { nbCopie: nbCopie, fieldType: fieldType, cardInfo: cardDialogInfo };
        } else {
            return null;
        }
    };

    const handleCloseCardDialog = () => {
        setOpenCardDialog(false);
    };

    const displayCardDialog = (): React.JSX.Element => {
        return (
            <Dialog open={openCardDialog} onClose={handleCloseCardDialog}>
                <DialogTitle>Add Card to Deck</DialogTitle>
                <Form setErrors={setErrors} setValues={setValues} fields={["cardField", "nbCopie"]}>
                    <DialogContent>
                        <DialogContentText>Please specify where you gonna add the card and in which quantity (3 max)</DialogContentText>
                        <Select name="cardField" label="Card Field" error={errors.cardField} loading={false}>
                            {cardFieldTypeArray.map((fieldTypeName) => {
                                return (
                                    <MenuItem key={`cardField-${fieldTypeName}`} value={fieldTypeName}>
                                        {Capitalize(fieldTypeName)}
                                    </MenuItem>
                                );
                            })}
                        </Select>
                        <InputNumber name="nbCopie" label="Quantity of the Card" max={3} min={1} error={errors.nbCopie} isPositif={true} />
                    </DialogContent>
                    <DialogActions>
                        <Button loading={false} type="button" onClick={handleCloseCardDialog}>
                            Cancel
                        </Button>
                        <Button loading={false}>Add Card To Deck</Button>
                    </DialogActions>
                </Form>
            </Dialog>
        );
    };

    const handleSort = () => {
        let newDeckCard: DeckCardType = { ...deckCard };
        cardFieldTypeArray.forEach((cardFieldType) => {
            const deckCardFromFieldTypeArray = deckCard[cardFieldType];
            newDeckCard[cardFieldType] = CardSort(deckCardFromFieldTypeArray);
        });
        setDeckCard(newDeckCard);
    };

    const displaySort = () => {
        return (
            <Grid item xs={12}>
                <Button icon={<SortIcon />} iconPosition={IconPositionEnumType.END} loading={false} onClick={handleSort}>
                    Sort
                </Button>
            </Grid>
        );
    };

    const displayAutoClick = () => {
        return (
            <Grid item xs={12}>
                <Switch
                    name="autoClick"
                    label="Enable auto-click ?"
                    error={undefined}
                    defaultValue={autoClick}
                    helperText={`The "auto-click" mode automatically places the cards in the ${DeckCardFieldType.MAIN_DECK} or ${DeckCardFieldType.EXTRA_DECK} zone`}
                    onChange={(e) => setAutoClick(e.target.checked)}
                />
            </Grid>
        );
    };

    const displayDeckCardWarning = (): React.JSX.Element | null => {
        return deckCardWarning !== null ? (
            <Grid item xs={12}>
                <Alert severity="warning" message={deckCardWarning} title="Deck not legal" />
            </Grid>
        ) : null;
    };

    return (
        <DashboardHome active={2} activeChild={1} title="Deck Create Page">
            <Grid item xs={12} container spacing={4}>
                <Grid item xs={12} md={6} container sx={{ height: "fit-content" }}>
                    <Grid item xs={12}>
                        <DeckCreateForm selectDeckArtowrkArray={selectDeckArtowrkArray} deckCard={deckCard} />
                    </Grid>
                    <Grid item xs={12} sx={{ marginTop: Theme.spacing(2) }} container spacing={2}>
                        {displayCardDialog()}
                        <SearchCardPopover
                            open={openPopover}
                            handleClose={handlePopoverClose}
                            cardInfoToDisplay={cardInfoToDisplay}
                            anchorEl={anchorEl}
                            anchorOriginPositionHorizontal="right"
                            anchorOriginPositionVertical="bottom"
                            transformOriginPositionHorizontal="left"
                            transformOriginPositionVertical="center"
                        />
                        {displayAutoClick()}
                        {displayDeckCardWarning()}
                        {displaySort()}
                        <DisplayDeckCard deckCard={deckCard} handleRemoveCard={removeCard} />
                    </Grid>
                </Grid>
                <Grid item xs={12} md={6} container spacing={2} sx={{ height: "fit-content" }}>
                    <Grid item xs={12}>
                        <CardSearchForm
                            offsetState={[offset, setOffset]}
                            loadingFormState={[loadingForm, setLoadingForm]}
                            setCardAllResultCount={setCardAllResultCount}
                            setCardResult={setCardResult}
                            limit={limit}
                            searchLimit={<SearchLimitSelect name="limit" valueArray={limitArray} limitState={[limit, setLimit]} />}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <SearchCardDisplay
                            offsetState={[offset, setOffset]}
                            cardResult={cardResult}
                            limit={limit}
                            cardAllResultCount={cardAllResultCount}
                            isFromCreatePage
                            openDialogState={[openCardDialog, setOpenCardDialog]}
                            setCardDialogInfo={setCardDialogInfo}
                            autoClick={autoClick}
                        />
                    </Grid>
                </Grid>
            </Grid>
        </DashboardHome>
    );
}
