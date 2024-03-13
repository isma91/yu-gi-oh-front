import Request from "@api/Request";
import { RequestMethodType } from "@app/types/Api";
import { CardGetInfoRequestType } from "@app/types/entity/Card";
import { GetFullRoute, CardApiRouteName } from "@routes/api/Card";

export default function GetInfo(uuid: string): Promise<CardGetInfoRequestType> {
    return Request(GetFullRoute(CardApiRouteName.GET_INFO, {uuid: uuid}), RequestMethodType.GET, "Error while getting Card info.", null, true);
}