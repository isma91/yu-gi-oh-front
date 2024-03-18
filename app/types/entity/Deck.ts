import { RequestGetAll, RequestGetInfo } from "@app/types/Request";
import { NameSlugNameEntity, TimestampableEntity } from "@app/types/Entity";
import { CardPictureGetAllType } from "@app/types/entity/CardPicture";
import { UserGetAllType } from "@app/types/entity/User";


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

export type DeckGetFromFilterFromCurrentUserTypeRequestType = {
    success: string;
    data: {
        deck: DeckGetAllFromCurrentUserType[];
        deckAllResultCount: number;
    };
}