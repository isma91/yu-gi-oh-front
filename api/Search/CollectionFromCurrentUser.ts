import Request from "@api/Request";
import { RequestMethodType } from "@app/types/Api";
import { CollectionGetFromFilterFromCurrentUserTypeRequestType } from "@app/types/entity/Collection";
import { GetFullRoute, SearchApiRouteName } from "@routes/api/Search";

export default function SearchCollectionFromCurrentUser(data: object): Promise<CollectionGetFromFilterFromCurrentUserTypeRequestType> {
    return Request(GetFullRoute(SearchApiRouteName.LIST_COLLECTION_CURRENT_USER), RequestMethodType.POST, "Error while getting your Collections.", data, true);
}