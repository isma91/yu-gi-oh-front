import Request from "@api/Request";
import { RequestMethodType } from "@app/types/Api";
import { DeckGetInfoRequestType } from "@app/types/entity/Deck";
import { GetFullRoute, DeckApiRouteName } from "@routes/api/Deck";

export default function DeckEditFromId(id: number, data: object): Promise<DeckGetInfoRequestType> {
    return Request(
        GetFullRoute(DeckApiRouteName.UPDATE_PUBLIC, { id: id.toString(10) }),
        RequestMethodType.POST,
        "Error while updating deck.",
        data,
        true
    );
}