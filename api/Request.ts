import Api from "@api/Api";
import { RequestMethodType } from "@app/types/Api";
import CreateFormData from "@utils/CreateFormData";
import { ResolvePromise, RejectPromise } from "@utils/SimplePromise";
import { AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";



const requestMethodTypeWithDataArray = [
    RequestMethodType.POST,
    RequestMethodType.PUT,
    RequestMethodType.PATCH,
];

const requestMethodTypeWithoutDataArray = [
    RequestMethodType.GET,
    RequestMethodType.PUT,
    RequestMethodType.DELETE,
];

/**
 *
 * Check if type is in the array and throw an Error if not
 *
 * @param {readonly string[]} array all request type acceptable
 * @param {string}   type             request type to check
 * @returns {void}
 * @throws {ReferenceError}
 */
function ThrowErrorIfNotGoodType(array: string[], type: string): void {
    if (array.includes(type) === false) {
        throw new ReferenceError(`Request type can only be ${array.join(", ")}`);
    }
}

/**
 *
 * @param {string} url
 * @param {RequestMethodType} [type="get"]
 * @param {string} errMsg
 * @param {object|null} [data=null]
 * @param {boolean} [isProtected=false]
 * @param {boolean} [isCreation=false]
 * @returns {Promise<any>}
 */
export default async function Request(
    url: string,
    type: RequestMethodType = RequestMethodType.GET,
    errMsg: string,
    data: object | null = null,
    isProtected: boolean = false,
    isCreation: boolean = false
): Promise<any> {
    const withData = data !== null;
    const arrayToCheck = withData === true ? requestMethodTypeWithDataArray : requestMethodTypeWithoutDataArray;
    ThrowErrorIfNotGoodType(arrayToCheck, type);
    let config: AxiosRequestConfig = {};
    if (isProtected === true) {
        config.protected = true;
    }
    const expectedHttpCode = (isCreation === true) ? 201 : 200;
    let request = ResolvePromise({ status: null, data: undefined });
    if (withData === true && data !== null) {
        const formData = CreateFormData(data);
        request = Api[type](url, formData, { ...config });
    } else {
        request = Api[type](url, { ...config });
    }
    return request
        .then((res) => {
            if (res.status === expectedHttpCode && res.data !== undefined) {
                return ResolvePromise(res.data);
            } else {
                return RejectPromise({ error: errMsg });
            }
        })
        .catch((errData) => {
            let err = "An error occurred.";
            if (errData.error !== undefined) {
                err = errData.error;
            } else {
                err = errData.response.data.detail;
            }
            if (err === "Network Error") {
                err = errMsg;
            }
            return RejectPromise(err);
        });
}