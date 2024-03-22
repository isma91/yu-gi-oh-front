import Request from "@api/Request";
import { RequestMethodType } from "@app/types/Api";
import { RequestSuccessType } from "@app/types/Request";
import { GetFullRoute, UserApiRouteName } from "@routes/api/User";

export default function EditPassword(data: object): Promise<RequestSuccessType> {
    return Request(GetFullRoute(UserApiRouteName.EDIT_PASSWORD), RequestMethodType.POST, "Error while changing your password.", data, true);
}