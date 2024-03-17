import { RequestGetAll, RequestGetInfo } from "@app/types/Request";
import { NameSlugNameEntity, TimestampableEntity } from "@app/types/Entity";
import { CardPictureGetAllType } from "@app/types/entity/CardPicture";


export type DeckEntityType = TimestampableEntity & NameSlugNameEntity & {
    id: number;
};

export type DeckGetAllFromCurrentUserType = NameSlugNameEntity & {
    id: number;
    isPublic: boolean;
    cardUniqueNumber: number;
    cardMainDeckNumber: number;
    cardExtraDeckNumber: number;
    cardSideDeckNumber: number;
    artworkUrl: Pick<CardPictureGetAllType, "artworkUrl">;
}

export type DeckGetAllFromCurrentUserRequestType = RequestGetAll<"deck", DeckGetAllFromCurrentUserType>;