import Request from "@api/Request";
import { RequestMethodType } from "@app/types/Api";
import { DeckGetInfoRequestType } from "@app/types/entity/Deck";
import { GetFullRoute, CollectionApiRouteName } from "@routes/api/Collection";

export default function CollectionEditFromId(id: number, data: object): Promise<DeckGetInfoRequestType> {
    return Request(
        GetFullRoute(CollectionApiRouteName.EDIT, { id: id.toString(10) }),
        RequestMethodType.POST,
        "Error while updating collection.",
        data,
        true
    );
}