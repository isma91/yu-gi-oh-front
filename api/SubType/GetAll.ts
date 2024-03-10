import Request from "@api/Request";
import { RequestMethodType } from "@app/types/Api";
import { SubTypeGetAllRequestType } from "@app/types/entity/SubType";
import { GetFullRoute, SubTypeApiRouteName } from "@routes/api/SubType";

export default function PropertyTypeGetAll(): Promise<SubTypeGetAllRequestType> {
    return Request(GetFullRoute(SubTypeApiRouteName.GET_ALL), RequestMethodType.GET, "Error while getting all Sub Type.", null, true);
}