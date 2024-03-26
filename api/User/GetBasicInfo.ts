import Request from "@api/Request";
import { RequestMethodType } from "@app/types/Api";
import { UserGetBasicInfoRequestType } from "@app/types/entity/User";
import { GetFullRoute, UserApiRouteName } from "@routes/api/User";

export default function UserGetBasicInfo(): Promise<UserGetBasicInfoRequestType> {
    return Request(GetFullRoute(UserApiRouteName.GET_BASIC_INFO), RequestMethodType.GET, "Error while getting your info.", null, true);
}