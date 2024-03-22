import Request from "@api/Request";
import { RequestMethodType } from "@app/types/Api";
import { SetGetAllType } from "@app/types/entity/Set";
import { GetFullRoute, SearchApiRouteName } from "@routes/api/Search";

export default function SearchSet(data: object): Promise<SetGetAllType> {
    return Request(GetFullRoute(SearchApiRouteName.SET), RequestMethodType.POST, "Error while search set.", data, true);
}