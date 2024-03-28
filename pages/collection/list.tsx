"use client";
import { useState } from "react";
import DashboardHome from "@components/dashboard/Home";
import { Grid } from "@mui/material";
import CollectionSearchCurrentUserForm from "@form/collection/search-current-user";
import SearchLimitSelect from "@components/search/LimitSelect";
import SearchCollectionDisplay from "@components/search/CollectionDisplay";
import { CollectionGetFromFilterFromCurrentUserType } from "@app/types/entity/Collection";

export default function CollectionListPage() {
    const [offset, setOffset] = useState<number>(0);
    const [limit, setLimit] = useState<number>(15);
    const [colllectionAllResultCount, setCollectionAllResultCount] = useState<number>(0);
    const [collectionResult, setCollectionResult] = useState<CollectionGetFromFilterFromCurrentUserType[]>([]);
    const [loadingForm, setLoadingForm] = useState(false);
    const limitArray: number[] = [15, 30, 45, 60];

    return (
        <DashboardHome active={4} activeChild={0} title="Deck List Page">
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <CollectionSearchCurrentUserForm
                        offsetState={[offset, setOffset]}
                        loadingFormState={[loadingForm, setLoadingForm]}
                        setCollectionAllResultCount={setCollectionAllResultCount}
                        setCollectionResult={setCollectionResult}
                        limit={limit}
                        searchLimit={<SearchLimitSelect name="limit" valueArray={limitArray} limitState={[limit, setLimit]} />}
                    />
                </Grid>
                <Grid item xs={12}>
                    <SearchCollectionDisplay
                        collectionResult={collectionResult}
                        collectionAllResultCount={colllectionAllResultCount}
                        limit={limit}
                        offsetState={[offset, setOffset]}
                    />
                </Grid>
            </Grid>
        </DashboardHome>
    );
}
