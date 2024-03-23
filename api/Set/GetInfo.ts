import Request from "@api/Request";
import { RequestMethodType } from "@app/types/Api";
import { SetGetInfoRequestType } from "@app/types/entity/Set";
import { GetFullRoute, SetApiRouteName } from "@routes/api/Set";

export default function SetGetInfo(id: number): Promise<SetGetInfoRequestType> {
    return Request(GetFullRoute(SetApiRouteName.GET_INFO, {id: id.toString(10)}), RequestMethodType.GET, "Error while getting Set.", null, true);
}