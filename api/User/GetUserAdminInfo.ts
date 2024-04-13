import Request from "@api/Request";
import { RequestMethodType } from "@app/types/Api";
import { UserGetUserAdminInfoRequestType } from "@app/types/entity/User";
import { GetFullRoute, UserApiRouteName } from "@routes/api/User";

export default function UserGetUserAdminInfo(id: number): Promise<UserGetUserAdminInfoRequestType> {
    return Request(
        GetFullRoute(UserApiRouteName.GET_ADMIN_INFO, { id: id.toString(10) }),
        RequestMethodType.GET,
        "Error while getting admin info.",
        null,
        true
    );
}