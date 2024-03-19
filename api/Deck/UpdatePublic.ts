import Request from "@api/Request";
import { RequestMethodType } from "@app/types/Api";
import { DeckGetInfoRequestType } from "@app/types/entity/Deck";
import { GetFullRoute, DeckApiRouteName } from "@routes/api/Deck";

export default function DeckUpdatePublicFromId(id: number, isPublic: number): Promise<DeckGetInfoRequestType> {
    return Request(
        GetFullRoute(DeckApiRouteName.UPDATE_PUBLIC, { id: id.toString(10), public: isPublic.toString(10) }),
        RequestMethodType.PUT,
        "Error while updating deck.",
        {},
        true
    );
}