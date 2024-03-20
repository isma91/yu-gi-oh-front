import React, { useState } from "react";
import DashboardHome from "@components/dashboard/Home";
import { useTheme, Grid } from "@mui/material";
import { CardSearchType } from "@app/types/entity/Card";
import DeckCreateForm from "@form/deck/create";
import { DeckCardFieldType, DeckCardType } from "@app/types/Deck";
import DeckSearchCard from "@components/deck/SearchCard";
import DisplayDeck from "@components/deck/DisplayDeck";

export default function DeckCreatePage() {
    const Theme = useTheme();
    const limitArray: number[] = [15, 30, 45, 60];
    const [deckCard, setDeckCard] = useState<DeckCardType>({
        [DeckCardFieldType.MAIN_DECK]: [],
        [DeckCardFieldType.EXTRA_DECK]: [],
        [DeckCardFieldType.SIDE_DECK]: [],
    });
    const [openCardDialog, setOpenCardDialog] = useState<boolean>(false);
    const [cardDialogInfo, setCardDialogInfo] = useState<CardSearchType | null>(null);
    const [autoClick, setAutoClick] = useState<boolean>(true);

    return (
        <DashboardHome active={2} activeChild={1} title="Deck Create Page">
            <Grid item xs={12} container spacing={4}>
                <Grid item xs={12} md={6} container sx={{ height: "fit-content" }}>
                    <Grid item xs={12}>
                        <DeckCreateForm deckCard={deckCard} />
                    </Grid>
                    <Grid item xs={12} sx={{ marginTop: Theme.spacing(2) }} container spacing={2}>
                        <DisplayDeck
                            deckCardState={[deckCard, setDeckCard]}
                            openDialogState={[openCardDialog, setOpenCardDialog]}
                            autoClickState={[autoClick, setAutoClick]}
                            cardDialogInfoState={[cardDialogInfo, setCardDialogInfo]}
                        />
                    </Grid>
                </Grid>
                <Grid item xs={12} md={6} container spacing={2} sx={{ height: "fit-content" }}>
                    <DeckSearchCard
                        openDialogState={[openCardDialog, setOpenCardDialog]}
                        limitArray={limitArray}
                        autoClick={autoClick}
                        setCardDialogInfo={setCardDialogInfo}
                    />
                </Grid>
            </Grid>
        </DashboardHome>
    );
}
