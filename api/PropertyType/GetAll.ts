import Request from "@api/Request";
import { RequestMethodType } from "@app/types/Api";
import { PropertyTypeGetAllRequestType } from "@app/types/entity/PropertyType";
import { GetFullRoute, PropertyTypeApiRouteName } from "@routes/api/PropertyType";

export default function PropertyTypeGetAll(): Promise<PropertyTypeGetAllRequestType> {
    return Request(GetFullRoute(PropertyTypeApiRouteName.GET_ALL), RequestMethodType.GET, "Error while getting all Property Type.", null, true);
}