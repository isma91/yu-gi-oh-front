import Request from "@api/Request";
import { RequestMethodType } from "@app/types/Api";
import { CardAttributeGetAllRequestType } from "@app/types/entity/CardAttribute";
import { GetFullRoute, CardAttributeApiRouteName } from "@routes/api/CardAttribute";

export default function CardAttributeGetAll(): Promise<CardAttributeGetAllRequestType> {
    return Request(GetFullRoute(CardAttributeApiRouteName.GET_ALL), RequestMethodType.GET, "Error while getting all Attribute.", null, true);
}