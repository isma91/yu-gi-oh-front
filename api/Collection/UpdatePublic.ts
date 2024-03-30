import Request from "@api/Request";
import { RequestMethodType } from "@app/types/Api";
import { CollectionGetInfoRequestType } from "@app/types/entity/Collection";
import { GetFullRoute, CollectionApiRouteName } from "@routes/api/Collection";

export default function CollectionUpdatePublicFromId(id: number, isPublic: number): Promise<CollectionGetInfoRequestType> {
    return Request(
        GetFullRoute(CollectionApiRouteName.UPDATE_PUBLIC, { id: id.toString(10), public: isPublic.toString(10) }),
        RequestMethodType.PUT,
        "Error while updating collection.",
        null,
        true
    );
}