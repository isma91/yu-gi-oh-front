import { RequestGetAll, RequestGetInfo } from "@app/types/Request";
import { TimestampableEntity } from "@app/types/Entity";
import { CardEntityType } from "@app/types/entity/Card";


export type CardPictureEntityType = TimestampableEntity & {
    id: number;
    picture: string | null;
    pictureSmall: string | null;
    artwork: string | null;
    idYGO: number;
    cards: CardEntityType[];
};

export type CardPictureGetAllType = {
    id: number;
    picture: string | null;
    pictureUrl: string | null;
    pictureSmall: string | null;
    pictureSmallUrl: string | null;
    artwork: string | null;
    artworkUrl: string | null;
    idYGO: number;
}

export type CardPictureGetAllRequestType = RequestGetAll<"cardPicture", CardPictureGetAllType>;

export type CardPictureGetInfoRequestType = RequestGetInfo<"cardPicture", CardPictureGetAllType>;