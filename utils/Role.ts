import { GlobalStateType } from "@app/types/GlobalState";
import AdminName from "@app/.admin-name";

export function IsAdmin(globalState: GlobalStateType): boolean {
    let newIsAdmin = false;
    if (globalState.user !== null && globalState.user.role !== undefined) {
        if (globalState.user.role === AdminName) {
            newIsAdmin = true;
        }
    }
    return newIsAdmin;
}