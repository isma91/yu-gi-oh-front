"use client";
import { useState, useEffect, useContext } from "react";
import DashboardHome from "@components/dashboard/Home";
import { StoreContext } from "@app/lib/state-provider";
import DeckListFromCurrentUserRequest from "@api/deck/ListFromCurrentUser";
import { useSnackbar } from "notistack";
import { DeckGetAllFromCurrentUserType } from "@app/types/entity/Deck";
import { Typography } from "@mui/material";

export default function DeckListPage() {
    const { state: globalState } = useContext(StoreContext);
    const { enqueueSnackbar } = useSnackbar();
    const [deck, setDeck] = useState<DeckGetAllFromCurrentUserType[]>([]);
    const [loadingDeck, setLoadingDeck] = useState(true);
    const [skipDeck, setSkipDeck] = useState<boolean>(false);

    const getAllUserDeckReq = async () => {
        return DeckListFromCurrentUserRequest()
            .then((res) => {
                setDeck(res.data.deck);
            })
            .catch((err) => {
                enqueueSnackbar(err, { variant: "error" });
            })
            .finally(() => {
                setLoadingDeck(false);
                setSkipDeck(true);
            });
    };

    useEffect(() => {
        if (globalState.user !== null && skipDeck === false) {
            getAllUserDeckReq();
        }
    }, [globalState, skipDeck]);

    return (
        <DashboardHome active={2} activeChild={0} title="Deck List Page">
            {loadingDeck === false
                ? deck.map((deckInfo) => {
                      const { id, name, isPublic, cardUniqueNumber, cardMainDeckNumber, cardExtraDeckNumber, cardSideDeckNumber, artworkUrl } =
                          deckInfo;
                      return (
                          <Typography key={`deck-${id}`} component="p">
                              {`name: ${name}`}
                              <br />
                              {`is public: ${isPublic}`}
                              <br />
                              {`card unique number: ${cardUniqueNumber}`}
                              <br />
                              {`card main deck number: ${cardMainDeckNumber}`}
                              <br />
                              {`card extra deck number: ${cardExtraDeckNumber}`}
                              <br />
                              {`card side deck number: ${cardSideDeckNumber}`}
                              <br />
                              {`artwork url ( can be null ): ${artworkUrl}`}
                              <br />
                          </Typography>
                      );
                  })
                : "loading"}
        </DashboardHome>
    );
}
