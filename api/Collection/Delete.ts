import Request from "@api/Request";
import { RequestMethodType } from "@app/types/Api";
import { RequestSuccessType } from "@app/types/Request";
import { GetFullRoute, CollectionApiRouteName } from "@routes/api/Collection";

export default function CollectionDeleteFromId(id: number): Promise<RequestSuccessType> {
    return Request(GetFullRoute(CollectionApiRouteName.DELETE, {id: id.toString(10)}), RequestMethodType.DELETE, "Error while deleting collection.", null, true);
}