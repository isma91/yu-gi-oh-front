import Request from "@api/Request";
import { RequestMethodType } from "@app/types/Api";
import { RequestSuccessType } from "@app/types/Request";
import { GetFullRoute, UserApiRouteName } from "@routes/api/User";

export default function UserCreate(data: object): Promise<RequestSuccessType> {
    return Request(GetFullRoute(UserApiRouteName.CREATE), RequestMethodType.POST, "Error while creating user.", data, true);
}