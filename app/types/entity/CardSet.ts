import { RequestGetAll, RequestGetInfo } from "@app/types/Request";
import { TimestampableEntity } from "@app/types/Entity";
import { CardEntityType } from "@app/types/entity/Card";
import { RarityEntityType, RarityGetAllType } from "@app/types/entity/Rarity";
import { SetEntityType, SetGetAllType } from "@app/types/entity/Set";


export type CardSetEntityType = TimestampableEntity & {
    id: number;
    sets: SetEntityType[];
    code: string | null;
    rarities: RarityEntityType[];
    card: CardEntityType;
};

export type CardSetGetAllType = {
    id: number;
    sets: SetGetAllType[];
    code: string | null;
    rarities: RarityGetAllType[];
}

export type CardSetGetAllRequestType = RequestGetAll<"cardSet", CardSetGetAllType>;

export type CardSetGetInfoRequestType = RequestGetInfo<"cardSet", CardSetGetAllType>;