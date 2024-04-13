import { TimestampableEntity, UuidStringType } from "@app/types/Entity";
import { UserTokenEntityType } from "@app/types/entity/UserToken";

export type UserTrackingEntityType = TimestampableEntity & {
    id: number;
    userToken: UserTokenEntityType;
    info: UserTrackingInfoType;
    route: string;
    fingerprint: string;
    uuid: UuidStringType;
};

export type UserTrackingInfoType = {
    ip: string;
    REMOTE_ADDR: string;
    HTTP_X_FORWARDED_FOR: string;
    HTTP_REMOTE_IP: string;
    HTTP_USER_AGENT: string;
    HTTP_ACCEPT_LANGUAGE: string;
    HTTP_ACCEPT_ENCODING: string;
    HTTP_REFERER: string;
    HTTP_X_FORWARDED_PROTO: string;
    REMOTE_ADDR_GEOIP: UserTrackingInfoGeoIpType;
    HTTP_X_FORWARDED_FOR_GEOIP: UserTrackingInfoGeoIpType;
    HTTP_REMOTE_IP_GEOIP: UserTrackingInfoGeoIpType;
}

export type UserTrackingInfoGeoIpType = {
    ASN: UserTrackingInfoGeoIpASNType;
    COUNTRY: UserTrackingInfoGeoIpCountryType;
    CITY: UserTrackingInfoGeoIpCityType;
}

export type UserTrackingInfoGeoIpASNType = {
    autonomous_system_number: number;
    autonomous_system_organization: string;
    ip_address: string;
    prefix_len: number;
    network: string;
}

type UserTrackingInfoGeoIpBasicObject = {
    geoname_id: number;
    name: string;
}

export type UserTrackingInfoGeoIpCountryType = {
    continent: UserTrackingInfoGeoIpBasicObject & {
        code: string;
    }
    country: UserTrackingInfoGeoIpBasicObject & {
        is_in_european_union: boolean;
        iso_code: string;
    }
}

export type UserTrackingInfoGeoIpCityType = UserTrackingInfoGeoIpCountryType & {
    subdivisions: Array<UserTrackingInfoGeoIpBasicObject & {
        iso_code: string;
    }>;
    city: UserTrackingInfoGeoIpBasicObject;
    postal: string;
    location: {
        accuracy_radius: number;
        latitude: number;
        longitude: number;
        time_zone: string;
    },
    address: string | null;
}