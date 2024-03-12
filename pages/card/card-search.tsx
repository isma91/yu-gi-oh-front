import { useState } from "react";
import DashboardHome from "@components/dashboard/Home";
import { Grid } from "@mui/material";
import CardSearchForm from "@form/card/search";
import { CardSearchType } from "@app/types/entity/Card";
import SearchLimit from "@components/specialField/SearchLimit";
import SearchCardDisplay from "@components/specialField/SearchCardDisplay";

export default function CardSearchPage() {
    const [offset, setOffset] = useState<number>(0);
    const [limit, setLimit] = useState<number>(15);
    const [cardAllResultCount, setCardAllResultCount] = useState<number>(0);
    const [loadingForm, setLoadingForm] = useState<boolean>(false);
    const [cardResult, setCardResult] = useState<CardSearchType[]>([]);
    const limitArray: number[] = [15, 30, 45, 60];

    return (
        <DashboardHome active={1} activeChild={0} title="Card Search Page">
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <CardSearchForm
                        offsetState={[offset, setOffset]}
                        loadingFormState={[loadingForm, setLoadingForm]}
                        setCardAllResultCount={setCardAllResultCount}
                        setCardResult={setCardResult}
                        limit={limit}
                        searchLimit={<SearchLimit name="limit" valueArray={limitArray} limitState={[limit, setLimit]} />}
                    />
                </Grid>
                <Grid item xs={12}>
                    <SearchCardDisplay
                        offsetState={[offset, setOffset]}
                        cardResult={cardResult}
                        limit={limit}
                        cardAllResultCount={cardAllResultCount}
                    />
                </Grid>
            </Grid>
        </DashboardHome>
    );
}
