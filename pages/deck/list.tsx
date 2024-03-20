"use client";
import { useState } from "react";
import DashboardHome from "@components/dashboard/Home";
import { DeckGetAllFromCurrentUserType } from "@app/types/entity/Deck";
import { Grid } from "@mui/material";
import DeckSearchCurrentUserForm from "@form/deck/search-current-user";
import SearchLimitSelect from "@components/search/LimitSelect";
import SearchDeckDisplay from "@components/search/DeckDisplay";

export default function DeckListPage() {
    const [offset, setOffset] = useState<number>(0);
    const [limit, setLimit] = useState<number>(15);
    const [deckAllResultCount, setDeckAllResultCount] = useState<number>(0);
    const [deckResult, setDeckResult] = useState<DeckGetAllFromCurrentUserType[]>([]);
    const [loadingForm, setLoadingForm] = useState(false);
    const limitArray: number[] = [15, 30, 45, 60];

    return (
        <DashboardHome active={2} activeChild={0} title="Deck List Page">
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <DeckSearchCurrentUserForm
                        offsetState={[offset, setOffset]}
                        loadingFormState={[loadingForm, setLoadingForm]}
                        setDeckAllResultCount={setDeckAllResultCount}
                        setDeckResult={setDeckResult}
                        limit={limit}
                        searchLimit={<SearchLimitSelect name="limit" valueArray={limitArray} limitState={[limit, setLimit]} />}
                    />
                </Grid>
                <Grid item xs={12}>
                    <SearchDeckDisplay
                        deckResult={deckResult}
                        deckAllResultCount={deckAllResultCount}
                        limit={limit}
                        offsetState={[offset, setOffset]}
                    />
                </Grid>
            </Grid>
        </DashboardHome>
    );
}
