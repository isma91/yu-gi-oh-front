import { NameSlugNameEntity, TimestampableEntity } from "@app/types/Entity";
import { CardPictureEntityType, CardPictureGetAllType } from "@app/types/entity/CardPicture";
import { CardEntityType, CardSearchType } from "@app/types/entity/Card";
import { SetEntityType, SetGetAllType } from "@app/types/entity/Set";
import { RarityEntityType, RarityGetAllType } from "@app/types/entity/Rarity";
import { CountryEntityType, CountryGetAllType } from "@app/types/entity/Country";


export type CardCollectionEntityType = TimestampableEntity & NameSlugNameEntity & {
    id: number;
    card: CardEntityType;
    nbCopie: number;
    cardSet: SetEntityType | null;
    rarity: RarityEntityType | null;
    country: CountryEntityType;
    picture: CardPictureEntityType;
};

export type CardCollectionGetInfoType = NameSlugNameEntity & {
    id: number;
    card: Omit<CardSearchType, "picture">;
    nbCopie: number;
    cardSet: SetGetAllType | null;
    rarity: RarityGetAllType | null;
    country: CountryGetAllType;
    picture: Pick<CardPictureGetAllType, "id" | "pictureSmallUrl" | "artworkUrl">;
};