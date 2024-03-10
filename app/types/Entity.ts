export interface TimestampableEntity {
    createdAt: Date | DateStringType;
    updatedAt: Date | DateStringType;
}

export interface NameSlugNameEntity {
    name: string;
    slugName: string;
}

export type DateStringType = string;

export type UuidStringType = string;