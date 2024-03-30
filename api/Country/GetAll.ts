import Request from "@api/Request";
import { RequestMethodType } from "@app/types/Api";
import { CountryGetAllRequestType } from "@app/types/entity/Country";
import { GetFullRoute, CountryApiRouteName } from "@routes/api/Country";

export default function CountryGetAll(): Promise<CountryGetAllRequestType> {
    return Request(GetFullRoute(CountryApiRouteName.GET_ALL), RequestMethodType.GET, "Error while getting all Country.", null, true);
}