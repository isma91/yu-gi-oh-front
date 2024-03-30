import { useCallback, useEffect, useMemo, useState } from "react";
import { useSnackbar } from "notistack";
import { DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, MenuItem, Dialog } from "@mui/material";
import SortIcon from "@mui/icons-material/Sort";
import DisplayDeckCard from "@components/deck/DisplayCard";
import Button from "@components/field/Button";
import Alert from "@components/feedback/Alert";
import Switch from "@components/field/Switch";
import SearchCardPopover from "@components/search/CardPopover";
import Form from "@components/util/Form";
import Select from "@components/field/Select";
import InputNumber from "@components/field/InputNumber";
import { DeckCardFieldType, DeckCardType } from "@app/types/Deck";
import { IconPositionEnumType } from "@app/types/Input";
import { CardInfoToDisplayType } from "@app/types/SearchCard";
import { CardSearchType } from "@app/types/entity/Card";
import { ArrayIncludes, CreateArrayNumber } from "@utils/Array";
import { Capitalize } from "@utils/String";
import { Sort as CardSort } from "@utils/CardSort";

type DisplayDeckPropsType = {
    deckCardState: [DeckCardType, React.Dispatch<React.SetStateAction<DeckCardType>>];
    autoClickState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
    openDialogState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
    cardDialogInfoState: [CardSearchType | null, React.Dispatch<React.SetStateAction<CardSearchType | null>>];
};

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

export default function DisplayDeck(props: DisplayDeckPropsType) {
    const { enqueueSnackbar } = useSnackbar();
    const [deckCard, setDeckCard] = props.deckCardState;
    const [openCardDialog, setOpenCardDialog] = props.openDialogState;
    const [autoClick, setAutoClick] = props.autoClickState;
    const [cardDialogInfo, setCardDialogInfo] = props.cardDialogInfoState;
    const [anchorEl, setAnchorEl] = useState<HTMLImageElement | null>(null);
    const openPopover = Boolean(anchorEl);
    const [cardInfoToDisplay, setCardInfoToDisplay] = useState<CardInfoToDisplayType | null>(null);
    const [values, setValues] = useState<ValuesType>({});
    const [errors, setErrors] = useState<ErrorsType>({});
    const [deckCardWarning, setDeckCardWarning] = useState<string | null>(null);
    const cardFieldTypeArray: DeckCardFieldType[] = Object.values(DeckCardFieldType);
    const nbCopieMaxPerCard = parseInt(process.env["NEXT_PUBLIC_NB_SAME_CARD_DECK"] as string, 10);
    const findFieldTypeFromCardInfo = useCallback((cardInfo: CardSearchType): DeckCardFieldType => {
        const { subCategory: cardInfoSubCategory, category: cardInfoCategory } = cardInfo;
        if (cardInfoCategory.slugName !== "monster") {
            return DeckCardFieldType.MAIN_DECK;
        }
        if (cardInfoSubCategory === null) {
            return DeckCardFieldType.MAIN_DECK;
        }
        if (cardInfoSubCategory.slugName.includes("ritual") === true) {
            return DeckCardFieldType.MAIN_DECK;
        }
        return DeckCardFieldType.EXTRA_DECK;
    }, []);
    const checkDeckCardWarning = useCallback((deckCard: DeckCardType): string | null => {
        const nbCardMinMainDeck = parseInt(process.env["NEXT_PUBLIC_NB_MIN_CARD_MAIN_DECK"] as string, 10);
        const nbCardMaxMainDeck = parseInt(process.env["NEXT_PUBLIC_NB_MAX_CARD_MAIN_DECK"] as string, 10);
        const nbCardMaxExtraDeck = parseInt(process.env["NEXT_PUBLIC_NB_MAX_CARD_EXTRA_DECK"] as string, 10);
        const nbCardMaxSideDeck = parseInt(process.env["NEXT_PUBLIC_NB_MAX_CARD_SIDE_DECK"] as string, 10);
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
        return newDeckCardWarning;
    }, []);
    const handleSort = useCallback((deckCard: DeckCardType): DeckCardType => {
        const deckCardFieldTypeArray = Object.values(DeckCardFieldType);
        let newDeckCard: DeckCardType = { ...deckCard };
        deckCardFieldTypeArray.forEach((cardFieldType) => {
            const deckCardFromFieldTypeArray = deckCard[cardFieldType];
            newDeckCard[cardFieldType] = CardSort(deckCardFromFieldTypeArray);
        });
        return newDeckCard;
    }, []);
    const removeCard = useCallback(
        (index: number, fieldType: DeckCardFieldType) => {
            let deckCardFieldTypeArray = [...deckCard[fieldType]];
            deckCardFieldTypeArray.splice(index, 1);
            setDeckCard((prevState) => {
                let newDeckCard = { ...prevState };
                newDeckCard[fieldType].splice(index, 1);
                return newDeckCard;
            });
        },
        [deckCard, setDeckCard]
    );
    const handlePopoverClose = useCallback(() => {
        setAnchorEl(null);
        setCardInfoToDisplay(null);
    }, []);
    const handleCloseCardDialog = useCallback(() => {
        setOpenCardDialog(false);
    }, [setOpenCardDialog]);
    const addCardInfoNbCopieTime = useCallback((cardInfo: CardSearchType, nbCopie: number): CardSearchType[] => {
        let array = [];
        const arrayNumber = CreateArrayNumber(1, nbCopie);
        for (let i = 0; i < arrayNumber.length; i++) {
            array.push(cardInfo);
        }
        return array;
    }, []);
    const findCardInfoArrayfromDeckCardFieldTypeAndCardInfoId = useCallback((deckCardFieldTypeArray: CardSearchType[], cardInfoId: number) => {
        let newArray: Array<{ index: number; cardInfo: CardSearchType }> = [];
        for (let i = 0; i < deckCardFieldTypeArray.length; i++) {
            const el = deckCardFieldTypeArray[i];
            if (el.id === cardInfoId) {
                newArray.push({ index: i, cardInfo: el });
            }
        }
        return newArray;
    }, []);
    const handleValues = useCallback(
        (newValues: NewValuesType): DeckCardType | null => {
            const { nbCopie, fieldType, cardInfo } = newValues;
            const { id: cardInfoId, subCategory: cardInfoSubCategory, category: cardInfoCategory } = cardInfo;
            let cardSubCategoryIsRitual = false;
            let cardSubCategoryIsMonster = false;
            if (cardInfoCategory.slugName === "monster") {
                cardSubCategoryIsMonster = true;
            }
            if (cardInfoSubCategory !== null) {
                const { slugName: cardInfoSubCategorySlugName } = cardInfoSubCategory;
                cardSubCategoryIsRitual = cardInfoSubCategorySlugName.includes("ritual");
            }
            if (
                (cardSubCategoryIsMonster === false || cardSubCategoryIsRitual === true || cardInfoSubCategory === null) &&
                fieldType === DeckCardFieldType.EXTRA_DECK
            ) {
                enqueueSnackbar("This card can't be in Extra-Deck zone.", { variant: "error" });
                return null;
            }
            if (
                cardSubCategoryIsMonster === true &&
                cardSubCategoryIsRitual === false &&
                cardInfoSubCategory !== null &&
                fieldType === DeckCardFieldType.MAIN_DECK
            ) {
                enqueueSnackbar("This card can't be in Main-Deck zone.", { variant: "error" });
                return null;
            }
            let newDeckCard = { ...deckCard };
            const cardInfoWithIndexArrayInDeckCardFieldType = findCardInfoArrayfromDeckCardFieldTypeAndCardInfoId(deckCard[fieldType], cardInfoId);
            const oldNbCopie = cardInfoWithIndexArrayInDeckCardFieldType.length;
            let newDeckCardFieldTypeArray = newDeckCard[fieldType];
            if (oldNbCopie === 0) {
                newDeckCardFieldTypeArray = newDeckCardFieldTypeArray.concat(addCardInfoNbCopieTime(cardInfo, nbCopie));
            } else if (oldNbCopie === nbCopieMaxPerCard) {
                enqueueSnackbar(`You already have the maximum amount of copie for this card in the ${fieldType} zone.`, { variant: "warning" });
                return null;
            } else {
                let newNbCopie = oldNbCopie + nbCopie;
                if (newNbCopie > nbCopieMaxPerCard) {
                    newNbCopie = nbCopieMaxPerCard;
                }
                const nbCopieToAdd = newNbCopie - oldNbCopie;
                newDeckCardFieldTypeArray = newDeckCardFieldTypeArray.concat(addCardInfoNbCopieTime(cardInfo, nbCopieToAdd));
            }
            newDeckCard[fieldType] = newDeckCardFieldTypeArray;
            return newDeckCard;
        },
        [enqueueSnackbar, deckCard, findCardInfoArrayfromDeckCardFieldTypeAndCardInfoId, addCardInfoNbCopieTime, nbCopieMaxPerCard]
    );
    const transformValuesToNewValues = useCallback((): NewValuesType | null => {
        let newValues: null | NewValuesType = null;
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
            newValues = { nbCopie: nbCopie, fieldType: fieldType, cardInfo: cardDialogInfo };
        }
        return newValues;
    }, [values, cardDialogInfo, nbCopieMaxPerCard, cardFieldTypeArray]);

    useEffect(() => {
        setDeckCardWarning(checkDeckCardWarning(deckCard));
    }, [deckCard, checkDeckCardWarning]);

    useEffect(() => {
        if (autoClick === true && cardDialogInfo !== null) {
            const newDeckCard = handleValues({
                fieldType: findFieldTypeFromCardInfo(cardDialogInfo),
                nbCopie: 1,
                cardInfo: cardDialogInfo,
            });
            if (newDeckCard !== null) {
                setDeckCard(newDeckCard);
            }
            setValues({});
            setCardDialogInfo(null);
        }
    }, [autoClick, cardDialogInfo, findFieldTypeFromCardInfo, handleValues, setDeckCard, setCardDialogInfo]);

    useEffect(() => {
        const valuesLength = Object.keys(values).length;
        const errorsLength = Object.keys(errors).length;
        if (valuesLength > 0 && errorsLength === 0) {
            handleCloseCardDialog();
            const newValues = transformValuesToNewValues();
            if (newValues === null) {
                enqueueSnackbar("Error while trying to add Card to Deck.", { variant: "error" });
            } else {
                const newDeckCard = handleValues(newValues);
                if (newDeckCard !== null) {
                    setDeckCard(newDeckCard);
                }
                setValues({});
            }
        }
    }, [values, errors, enqueueSnackbar, transformValuesToNewValues, handleCloseCardDialog, handleValues, setDeckCard]);

    const displayDialog = (): React.JSX.Element => {
        return (
            <Dialog open={openCardDialog} onClose={handleCloseCardDialog}>
                <DialogTitle>Add Card to Deck</DialogTitle>
                <Form setErrors={setErrors} setValues={setValues} fields={["cardField", "nbCopie"]}>
                    <DialogContent>
                        <DialogContentText>Please specify where you gonna add the card and in which quantity (3 max)</DialogContentText>
                        <Select name="cardField" label="Card Field" error={errors.cardField} loading={false}>
                            {Object.values(DeckCardFieldType).map((fieldTypeName) => {
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

    return (
        <>
            {displayDialog()}
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
            {deckCardWarning !== null ? (
                <Grid item xs={12}>
                    <Alert severity="warning" message={deckCardWarning} title="Deck not legal" />
                </Grid>
            ) : null}
            <Grid item xs={12}>
                <Button
                    icon={<SortIcon />}
                    iconPosition={IconPositionEnumType.END}
                    loading={false}
                    onClick={(e) => setDeckCard(handleSort(deckCard))}
                >
                    Sort
                </Button>
            </Grid>
            <DisplayDeckCard deckCard={deckCard} handleRemoveCard={removeCard} displayRemoveIcon={true} />
        </>
    );
}
