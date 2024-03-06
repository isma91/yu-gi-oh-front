export interface TimestampableEntity {
    createdAt: Date | DateStringType;
    updatedAt: Date | DateStringType;
}

export type DateStringType = string;

export type UuidStringType = string;