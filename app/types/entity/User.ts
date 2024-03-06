import { RequestGetAll, RequestGetInfo, RequestSuccessWithDataType } from "@app/types/Request";
import { DateStringType, TimestampableEntity } from "@app/types/Entity";

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

export type UserGetAllRequestType = RequestGetAll<"user", UserGetAllType>;

export type UserGetInfoRequestType = RequestGetInfo<"user", UserGetAllType>;