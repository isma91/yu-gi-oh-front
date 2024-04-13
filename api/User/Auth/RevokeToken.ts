import Request from "@api/Request";
import { RequestMethodType } from "@app/types/Api";
import { RequestSuccessType } from "@app/types/Request";
import { GetFullRoute, UserApiRouteName } from "@routes/api/User";

export default function UserRevokeToken(id: number): Promise<RequestSuccessType> {
    return Request(
        GetFullRoute(UserApiRouteName.REVOKE_TOKEN, { id: id.toString(10) }),
        RequestMethodType.DELETE,
        "Error while revoking token.",
        null,
        true
    );
}