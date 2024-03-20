import Request from "@api/Request";
import { RequestMethodType } from "@app/types/Api";
import { RequestSuccessType } from "@app/types/Request";
import { GetFullRoute, DeckApiRouteName } from "@routes/api/Deck";

export default function DeckCreate(data: object): Promise<RequestSuccessType> {
    return Request(GetFullRoute(DeckApiRouteName.CREATE), RequestMethodType.POST, "Error while creating deck.", data, true, true);
}