import { TimestampableEntity, UuidStringType } from "@app/types/Entity";
import { UserEntityType } from "@app/types/entity/User";

export type UserTokenEntityType = TimestampableEntity & {
    id: number;
    token: string;
    info: Array<any>;
    fingerprint: string;
    user: UserEntityType;
    uuid: UuidStringType;
};