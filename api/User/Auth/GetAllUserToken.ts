import Request from "@api/Request";
import { RequestMethodType } from "@app/types/Api";
import { UserGetAllUserTokenInfoRequestType } from "@app/types/entity/User";
import { GetFullRoute, UserApiRouteName } from "@routes/api/User";

export default function UserGetAllUserToken(): Promise<UserGetAllUserTokenInfoRequestType> {
    return Request(GetFullRoute(UserApiRouteName.GET_ALL_USER_TOKEN), RequestMethodType.GET, "Error while getting all your token info.", null, true);
}