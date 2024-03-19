import Request from "@api/Request";
import { RequestMethodType } from "@app/types/Api";
import { DeckGetInfoRequestType } from "@app/types/entity/Deck";
import { GetFullRoute, DeckApiRouteName } from "@routes/api/Deck";

export default function DeckGetInfo(id: number): Promise<DeckGetInfoRequestType> {
    return Request(GetFullRoute(DeckApiRouteName.GET_INFO, {id: id.toString(10)}), RequestMethodType.GET, "Error while getting deck.", null, true);
}