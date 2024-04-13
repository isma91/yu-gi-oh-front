import { RequestGetAll, RequestGetInfo, RequestSuccessWithDataType } from "@app/types/Request";
import { DateStringType, TimestampableEntity } from "@app/types/Entity";
import { DeckGetAllFromCurrentUserType } from "@app/types/entity/Deck";
import { CollectionGetInfoType } from "@app/types/entity/Collection";
import { UserTokenEntityType } from "@app/types/entity/UserToken";
import { UserTrackingEntityType, UserTrackingInfoGeoIpCityType, UserTrackingInfoType } from "@app/types/entity/UserTracking";

export type UserLoginRequestType = RequestSuccessWithDataType<"userInfo", UserLoginType>;

export type UserEntityType = TimestampableEntity & {
    id: number;
    username: string;
    password: string;
    roles: string[];
    userTokens: UserTokenEntityType[];
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

export type UserGetBasicInfoCollectionType = Pick<CollectionGetInfoType, "id" | "name" | "slugName" | "isPublic" | "artworkUrl" | "cardCardCollectionNumber">;

export type UserGetBasicInfoType = {
    username: string;
    decks: UserGetBasicInfoDeckType[];
    cardCollections: UserGetBasicInfoCollectionType[];
}

export type UserGetAllUserInfoType = UserGetAllType & {
    userTokenCount: number;
    updatedAt: DateStringType;
}

export type UserGetAdminInfoType = UserGetAllType & {
    userTokens: UserGetAllUserInfoUserTokenType[],
    updatedAt: DateStringType;
}

export type UserGetAllUserInfoUserTokenType = Omit<UserTokenEntityType, "user" | "userTrackings"> & {
    userTrackings: Array<Omit<UserTrackingEntityType, "userToken">>
};

export type UserGetAllUserTokenType = Pick<UserTokenEntityType, "id" | "expiratedAt" | "nbUsage"> & {
    ip: UserTrackingInfoType["ip"] | null;
    mostPreciseIp: UserTrackingInfoType["ip"] | null;
    geoip: Pick<UserTrackingInfoGeoIpCityType["location"], "latitude" | "longitude" | "accuracy_radius"> | null;
    address: UserTrackingInfoGeoIpCityType["address"]
};

export type UserGetAllRequestType = RequestGetAll<"user", UserGetAllType>;

export type UserGetInfoRequestType = RequestGetInfo<"user", UserGetAllType>;

export type UserGetBasicInfoRequestType = RequestGetInfo<"user", UserGetBasicInfoType>;

export type UserGetAllUserInfoRequestType = RequestGetAll<"user", UserGetAllUserInfoType>;

export type UserGetUserAdminInfoRequestType = RequestGetInfo<"user", UserGetAdminInfoType>;

export type UserGetAllUserTokenInfoRequestType = RequestGetAll<"userToken", UserGetAllUserTokenType>;