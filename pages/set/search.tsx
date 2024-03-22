import { useState } from "react";
import DashboardHome from "@components/dashboard/Home";
import { Grid } from "@mui/material";
import CardSearchForm from "@form/card/search";
import { CardSearchType } from "@app/types/entity/Card";
import SearchLimitSelect from "@components/search/LimitSelect";
import SearchCardDisplay from "@components/search/CardDisplay";

export default function SetSearchPage() {
    const [offset, setOffset] = useState<number>(0);
    const [limit, setLimit] = useState<number>(15);
    const [cardAllResultCount, setCardAllResultCount] = useState<number>(0);
    const [loadingForm, setLoadingForm] = useState<boolean>(false);
    const [cardResult, setCardResult] = useState<CardSearchType[]>([]);
    const limitArray: number[] = [15, 30, 45, 60];

    return (
        <DashboardHome active={2} activeChild={0} title="Set Search Page">
            <Grid container spacing={2}></Grid>
        </DashboardHome>
    );
}
