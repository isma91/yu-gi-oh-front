import { useState } from "react";
import { CardSearchType } from "@app/types/entity/Card";
import SearchCardDisplay from "@components/search/CardDisplay";
import SearchLimitSelect from "@components/search/LimitSelect";
import CardSearchForm from "@form/card/search";
import { Grid } from "@mui/material";

type DeckSearchCardPropsType = {
    openDialogState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
    limitArray: number[];
    autoClick: boolean;
    setCardDialogInfo: React.Dispatch<React.SetStateAction<CardSearchType | null>>;
};

export default function DeckSearchCard(props: DeckSearchCardPropsType) {
    const { autoClick, limitArray, setCardDialogInfo } = props;
    const [offset, setOffset] = useState<number>(0);
    const [loadingForm, setLoadingForm] = useState<boolean>(true);
    const [cardAllResultCount, setCardAllResultCount] = useState<number>(0);
    const [cardResult, setCardResult] = useState<CardSearchType[]>([]);
    const [limit, setLimit] = useState<number>(15);

    return (
        <>
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
                    openDialogState={props.openDialogState}
                    setCardDialogInfo={setCardDialogInfo}
                    autoClick={autoClick}
                />
            </Grid>
        </>
    );
}
