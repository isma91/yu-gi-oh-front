import Request from "@api/Request";
import { RequestMethodType } from "@app/types/Api";
import { CategoryGetAllRequestType } from "@app/types/entity/Category";
import { GetFullRoute, CategoryApiRouteName } from "@routes/api/Category";

export default function CategoryGetAll(): Promise<CategoryGetAllRequestType> {
    return Request(GetFullRoute(CategoryApiRouteName.GET_ALL), RequestMethodType.GET, "Error while getting all Category.", null, true);
}