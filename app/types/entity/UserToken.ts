import { DateStringType, TimestampableEntity } from "@app/types/Entity";
import { UserEntityType } from "@app/types/entity/User";
import { UserTrackingEntityType } from "@app/types/entity/UserTracking";

export type UserTokenEntityType = TimestampableEntity & {
    id: number;
    token: string;
    user: UserEntityType;
    userTrackings: UserTrackingEntityType[];
    expiratedAt: DateStringType;
    deletedAt: DateStringType;
    nbUsage: number;
};