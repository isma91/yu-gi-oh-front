import Request from "@api/Request";
import { RequestMethodType } from "@app/types/Api";
import { DeckGetFromFilterFromCurrentUserTypeRequestType } from "@app/types/entity/Deck";
import { GetFullRoute, SearchApiRouteName } from "@routes/api/Search";

export default function SearchDeckFromCurrentUser(data: object): Promise<DeckGetFromFilterFromCurrentUserTypeRequestType> {
    return Request(GetFullRoute(SearchApiRouteName.LIST_CURRENT_USER), RequestMethodType.POST, "Error while getting your Decks.", data, true);
}