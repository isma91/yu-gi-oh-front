import Request from "@api/Request";
import { RequestMethodType } from "@app/types/Api";
import { CollectionGetInfoRequestType } from "@app/types/entity/Collection";
import { GetFullRoute, CollectionApiRouteName } from "@routes/api/Collection";

export default function CollectionGetInfo(id: number): Promise<CollectionGetInfoRequestType> {
    return Request(GetFullRoute(CollectionApiRouteName.GET_INFO, {id: id.toString(10)}), RequestMethodType.GET, "Error while getting collection.", null, true);
}