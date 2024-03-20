import Request from "@api/Request";
import { RequestMethodType } from "@app/types/Api";
import { RequestSuccessType } from "@app/types/Request";
import { GetFullRoute, DeckApiRouteName } from "@routes/api/Deck";

export default function DeckDeleteFromId(id: number): Promise<RequestSuccessType> {
    return Request(GetFullRoute(DeckApiRouteName.DELETE, {id: id.toString(10)}), RequestMethodType.DELETE, "Error while deleting deck.", null, true);
}