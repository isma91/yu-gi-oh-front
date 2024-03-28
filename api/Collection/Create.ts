import Request from "@api/Request";
import { RequestMethodType } from "@app/types/Api";
import { RequestSuccessType } from "@app/types/Request";
import { GetFullRoute, CollectionApiRouteName } from "@routes/api/Collection";

export default function CollectionCreate(data: object): Promise<RequestSuccessType> {
    return Request(GetFullRoute(CollectionApiRouteName.CREATE), RequestMethodType.POST, "Error while creating collection.", data, true, true);
}