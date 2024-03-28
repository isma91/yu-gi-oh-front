import { CardCollectionInfoType } from "@app/types/Collection";
import { CardSearchType } from "@app/types/entity/Card";
import DisplayCollection from "@components/collection/DisplayCollection";
import DashboardHome from "@components/dashboard/Home";
import DeckSearchCard from "@components/deck/SearchCard";
import CollectionCreateForm from "@form/collection/create";
import { Grid } from "@mui/material";
import { useState } from "react";

export default function CollectionCreatePage() {
    const [openCardDialog, setOpenCardDialog] = useState<boolean>(false);
    const [cardDialogInfo, setCardDialogInfo] = useState<CardSearchType | null>(null);
    const [cardCollection, setCardCollection] = useState<CardCollectionInfoType[]>([]);
    const limitArray: number[] = [15, 30, 45, 60];

    return (
        <DashboardHome active={4} activeChild={1} title="Create Collection page">
            <Grid item xs={12} container spacing={2}>
                <Grid item xs={12} md={6} container spacing={2} sx={{ height: "fit-content" }}>
                    <Grid item xs={12}>
                        <CollectionCreateForm cardCollection={cardCollection} />
                    </Grid>
                    <Grid item xs={12}>
                        <DisplayCollection
                            cardCollectionState={[cardCollection, setCardCollection]}
                            openDialogState={[openCardDialog, setOpenCardDialog]}
                            cardDialogInfoState={[cardDialogInfo, setCardDialogInfo]}
                        />
                    </Grid>
                </Grid>
                <Grid item xs={12} md={6} container spacing={2} sx={{ height: "fit-content" }}>
                    <DeckSearchCard
                        openDialogState={[openCardDialog, setOpenCardDialog]}
                        limitArray={limitArray}
                        autoClick={false}
                        setCardDialogInfo={setCardDialogInfo}
                    />
                </Grid>
            </Grid>
        </DashboardHome>
    );
}
