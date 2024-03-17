import Request from "@api/Request";
import { RequestMethodType } from "@app/types/Api";
import { DeckGetAllFromCurrentUserRequestType } from "@app/types/entity/Deck";
import { GetFullRoute, DeckApiRouteName } from "@routes/api/Deck";

export default function DeckListFromCurrentUser(): Promise<DeckGetAllFromCurrentUserRequestType> {
    return Request(GetFullRoute(DeckApiRouteName.LIST_CURRENT_USER), RequestMethodType.GET, "Error while getting your Decks.", null, true);
}