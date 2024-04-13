import Request from "@api/Request";
import { RequestMethodType } from "@app/types/Api";
import { UserGetAllUserInfoRequestType} from "@app/types/entity/User";
import { GetFullRoute, UserApiRouteName } from "@routes/api/User";

export default function UserGetAllUserInfo(): Promise<UserGetAllUserInfoRequestType> {
    return Request(GetFullRoute(UserApiRouteName.GET_ALL), RequestMethodType.GET, "Error while getting all user info.", null, true);
}