import { useState } from "react";
import DashboardHome from "@components/dashboard/Home";
import { Grid } from "@mui/material";
import { SetSearchType } from "@app/types/entity/Set";
import SetSearchForm from "@form/set/search";
import SearchLimitSelect from "@components/search/LimitSelect";
import SearchSetDisplay from "@components/search/SetDisplay";

export default function SetSearchPage() {
    const [offset, setOffset] = useState<number>(0);
    const [limit, setLimit] = useState<number>(30);
    const [setAllResultCount, setSetAllResultCount] = useState<number>(0);
    const [loadingForm, setLoadingForm] = useState<boolean>(false);
    const [setResult, setSetResult] = useState<SetSearchType[]>([]);
    const limitArray: number[] = [30, 45, 60];

    return (
        <DashboardHome active={2} activeChild={0} title="Set Search Page">
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <SetSearchForm
                        offsetState={[offset, setOffset]}
                        loadingFormState={[loadingForm, setLoadingForm]}
                        setSetAllResultCount={setSetAllResultCount}
                        setSetResult={setSetResult}
                        limit={limit}
                        searchLimit={<SearchLimitSelect name="limit" valueArray={limitArray} limitState={[limit, setLimit]} />}
                    />
                </Grid>
                <Grid item xs={12}>
                    <SearchSetDisplay setResult={setResult} setAllResultCount={setAllResultCount} limit={limit} offsetState={[offset, setOffset]} />
                </Grid>
            </Grid>
        </DashboardHome>
    );
}
