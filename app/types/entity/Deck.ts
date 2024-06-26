import { RequestGetAll, RequestGetInfo } from "@app/types/Request";
import { NameSlugNameEntity, TimestampableEntity } from "@app/types/Entity";
import { UserGetAllType } from "@app/types/entity/User";
import { CardMainDeckGetInfoType } from "@app/types/entity/CardMainDeck";
import { CardExtraDeckGetInfoType } from "@app/types/entity/CardExtraDeck";
import { CardSideDeckGetInfoType } from "@app/types/entity/CardSideDeck";


export type DeckEntityType = TimestampableEntity & NameSlugNameEntity & {
    id: number;
};

export type DeckGetAllFromCurrentUserType = NameSlugNameEntity & {
    id: number;
    isPublic: boolean;
    user: Pick<UserGetAllType, "username">;
    cardUniqueNumber: number;
    cardMainDeckNumber: number;
    cardExtraDeckNumber: number;
    cardSideDeckNumber: number;
    artworkUrl: string | null;
}

export type DeckGetInfoType = NameSlugNameEntity & {
    id: number;
    isPublic: boolean;
    user: Pick<UserGetAllType, "username">;
    cardMainDecks: CardMainDeckGetInfoType[],
    cardExtraDecks: CardExtraDeckGetInfoType[],
    cardSideDecks: CardSideDeckGetInfoType[],
    artworkUrl: string | null;
    artworkCardId: number | null;
}

export type DeckGetFromFilterFromCurrentUserTypeRequestType = {
    success: string;
    data: {
        deck: DeckGetAllFromCurrentUserType[];
        deckAllResultCount: number;
    };
}

export type DeckGetInfoRequestType = RequestGetInfo<"deck", DeckGetInfoType>;