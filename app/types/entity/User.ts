import { RequestGetAll, RequestGetInfo, RequestSuccessWithDataType } from "@app/types/Request";
import { DateStringType, TimestampableEntity } from "@app/types/Entity";
import { DeckGetAllFromCurrentUserType } from "@app/types/entity/Deck";

export type UserLoginRequestType = RequestSuccessWithDataType<"userInfo", UserLoginType>;

export type UserEntityType = TimestampableEntity & {
    id: number;
    password: string;
    roles: string[];
    token: string;
};

export type UserLoginType = {
    jwt: string;
    username: string;
    role: string;
}

export type UserGetAllType = {
    id: number;
    username: string;
    role: any;
    createdAt: DateStringType;
}

export type UserGetBasicInfoDeckType = Pick<DeckGetAllFromCurrentUserType, "id" | "name" | "slugName" | "isPublic" | "cardMainDeckNumber" | "cardExtraDeckNumber" | "cardSideDeckNumber" | "artworkUrl">;

export type UserGetBasicInfoType = {
    username: string;
    decks: UserGetBasicInfoDeckType[];
}

export type UserGetAllRequestType = RequestGetAll<"user", UserGetAllType>;

export type UserGetInfoRequestType = RequestGetInfo<"user", UserGetAllType>;

export type UserGetBasicInfoRequestType = RequestGetInfo<"user", UserGetBasicInfoType>;