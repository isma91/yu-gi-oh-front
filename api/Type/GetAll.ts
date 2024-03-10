import Request from "@api/Request";
import { RequestMethodType } from "@app/types/Api";
import { TypeGetAllRequestType } from "@app/types/entity/Type";
import { GetFullRoute, TypeApiRouteName } from "@routes/api/Type";

export default function PropertyTypeGetAll(): Promise<TypeGetAllRequestType> {
    return Request(GetFullRoute(TypeApiRouteName.GET_ALL), RequestMethodType.GET, "Error while getting all Type.", null, true);
}