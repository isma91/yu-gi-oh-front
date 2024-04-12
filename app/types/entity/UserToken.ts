import { DateStringType, TimestampableEntity, UuidStringType } from "@app/types/Entity";
import { UserEntityType } from "@app/types/entity/User";

export type UserTokenEntityType = TimestampableEntity & {
    id: number;
    token: string;
    info: UserTokenInfoType;
    fingerprint: string;
    user: UserEntityType;
    uuid: UuidStringType;
    expiratedAt: DateStringType;
    deletedAt: DateStringType;
};

type UserTokenInfoType = {
    ip: string;
    REMOTE_ADDR: string;
    HTTP_X_FORWARDED_FOR: string;
    HTTP_REMOTE_IP: string;
    HTTP_USER_AGENT: string;
    HTTP_ACCEPT_LANGUAGE: string;
    HTTP_ACCEPT_ENCODING: string;
    HTTP_REFERER: string;
    HTTP_X_FORWARDED_PROTO: string;
    REMOTE_ADDR_GEOIP: UserTokenInfoGeoIpType;
    HTTP_X_FORWARDED_FOR_GEOIP: UserTokenInfoGeoIpType;
    HTTP_REMOTE_IP_GEOIP: UserTokenInfoGeoIpType;
}

type UserTokenInfoGeoIpType = {
    ASN: UserTokenInfoGeoIpASNType;
    COUNTRY: UserTokenInfoGeoIpCountryType;
    CITY: UserTokenInfoGeoIpCityType;
}

type UserTokenInfoGeoIpASNType = {
    autonomous_system_number: number;
    autonomous_system_organization: string;
    ip_address: string;
    prefix_len: number;
    network: string;
}

type UserTokenInfoGeoIpBasicObject = {
    geoname_id: number;
    name: string;
}

type UserTokenInfoGeoIpCountryType = {
    continent: UserTokenInfoGeoIpBasicObject & {
        code: string;
    }
    country: UserTokenInfoGeoIpBasicObject & {
        is_in_european_union: boolean;
        iso_code: string;
    }
}

type UserTokenInfoGeoIpCityType = UserTokenInfoGeoIpCountryType & {
    subdivisions: Array<UserTokenInfoGeoIpBasicObject & {
        iso_code: string;
    }>;
    city: UserTokenInfoGeoIpBasicObject;
    postal: string;
    location: {
        accuracy_radius: number;
        latitude: number;
        longitude: number;
        time_zone: string;
    }
}