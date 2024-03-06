import Request from "@api/Request";
import { RequestMethodType } from "@app/types/Api";
import { UserLoginRequestType } from "@app/types/entity/User";
import { GetFullRoute, UserApiRouteName } from "@routes/api/User";

export default function RefreshLogin(): Promise<UserLoginRequestType> {
    return Request(GetFullRoute(UserApiRouteName.REFRESH_LOGIN), RequestMethodType.GET, "Error while login in.", null, true);
}