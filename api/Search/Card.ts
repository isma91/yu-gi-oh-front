import Request from "@api/Request";
import { RequestMethodType } from "@app/types/Api";
import { CardSearchRequestType } from "@app/types/entity/Card";
import { GetFullRoute, SearchApiRouteName } from "@routes/api/Search";

export default function Search(data: object): Promise<CardSearchRequestType> {
    return Request(GetFullRoute(SearchApiRouteName.CARD), RequestMethodType.POST, "Error while search card.", data, true);
}