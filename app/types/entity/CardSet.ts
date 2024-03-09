import { RequestGetAll, RequestGetInfo } from "@app/types/Request";
import { TimestampableEntity } from "@app/types/Entity";
import { CardEntityType } from "@app/types/entity/Card";
import { RarityEntityType } from "@app/types/entity/Rarity";
import { SetEntityType } from "@app/types/entity/Set";


export type CardSetEntityType = TimestampableEntity & {
    id: number;
    sets: SetEntityType[];
    code: string | null;
    rarities: RarityEntityType[];
    card: CardEntityType;
};

export type CardSetGetAllType = {
    id: number;
}

export type CardSetGetAllRequestType = RequestGetAll<"CardSet", CardSetGetAllType>;

export type CardSetGetInfoRequestType = RequestGetInfo<"CardSet", CardSetGetAllType>;