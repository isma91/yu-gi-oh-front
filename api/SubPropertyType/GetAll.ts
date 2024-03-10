import Request from "@api/Request";
import { RequestMethodType } from "@app/types/Api";
import { SubPropertyTypeGetAllRequestType } from "@app/types/entity/SubPropertyType";
import { GetFullRoute, SubPropertyTypeApiRouteName } from "@routes/api/SubPropertyType";

export default function PropertyTypeGetAll(): Promise<SubPropertyTypeGetAllRequestType> {
    return Request(GetFullRoute(SubPropertyTypeApiRouteName.GET_ALL), RequestMethodType.GET, "Error while getting all Sub Property Type.", null, true);
}