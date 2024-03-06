import Request from "@api/Request";
import { RequestMethodType } from "@app/types/Api";
import { UserLoginRequestType } from "@app/types/entity/User";
import { GetFullRoute, UserApiRouteName } from "@routes/api/User";

export default function Login(data: object): Promise<UserLoginRequestType> {
    return Request(GetFullRoute(UserApiRouteName.LOGIN), RequestMethodType.POST, "Error while login in.", data);
}