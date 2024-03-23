import Request from "@api/Request";
import { RequestMethodType } from "@app/types/Api";
import { CardGetRandomRequestType } from "@app/types/entity/Card";
import { GetFullRoute, CardApiRouteName } from "@routes/api/Card";

export default function CardGetRandom(): Promise<CardGetRandomRequestType> {
    return Request(GetFullRoute(CardApiRouteName.RANDOM), RequestMethodType.GET, "Random Card not found DAMN !!!");
}