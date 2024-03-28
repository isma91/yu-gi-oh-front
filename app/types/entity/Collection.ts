import { NameSlugNameEntity, TimestampableEntity } from "@app/types/Entity";
import { RequestGetInfo } from "@app/types/Request";
import { CardPictureEntityType } from "@app/types/entity/CardPicture";
import { UserEntityType } from "@app/types/entity/User";


export type CollectionEntityType = TimestampableEntity & NameSlugNameEntity & {
    id: number;
    isPublic: boolean;
    artwork: CardPictureEntityType | null;
    cardCardCollections: [];
    user: UserEntityType
};

export type CollectionGetInfoType = NameSlugNameEntity & {
    id: number;
    isPublic: boolean;
    artworkUrl: string | null;
    cardCardCollections: [];
    cardCardCollectionNumber: number;
    user: Pick<UserEntityType, "username">;
};

export type CollectionGetFromFilterFromCurrentUserType = Pick<CollectionGetInfoType, "id" | "name" | "slugName" | "isPublic" | "artworkUrl" | "cardCardCollectionNumber" | "user">;

export type CollectionGetFromFilterFromCurrentUserTypeRequestType = {
    success: string;
    data: {
        collection: CollectionGetFromFilterFromCurrentUserType[];
        collectionAllResultCount: number;
    };
}

export type CollectionGetInfoRequestType = RequestGetInfo<"collection", CollectionGetInfoType>;