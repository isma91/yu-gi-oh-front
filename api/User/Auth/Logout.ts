import Request from "@api/Request";
import { RequestMethodType } from "@app/types/Api";
import { RequestSuccessType } from "@app/types/Request";
import { GetFullRoute, UserApiRouteName } from "@routes/api/User";

export default function Logout(): Promise<RequestSuccessType> {
    return Request(GetFullRoute(UserApiRouteName.LOGOUT), RequestMethodType.GET, "Error while logout.", null, true);
}