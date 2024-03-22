import Request from "@api/Request";
import { RequestMethodType } from "@app/types/Api";
import { RequestSuccessType } from "@app/types/Request";
import { GetFullRoute, UserApiRouteName } from "@routes/api/User";

export default function EditUsername(username: string): Promise<RequestSuccessType> {
    return Request(
        GetFullRoute(UserApiRouteName.EDIT_USERNAME, { username: username }),
        RequestMethodType.PUT,
        "Error while changing your username.",
        null,
        true
    );
}