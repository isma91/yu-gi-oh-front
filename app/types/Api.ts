declare module "axios" {
    export interface AxiosRequestConfig {
        protected?: boolean
    }
} 

export enum RequestMethodType {
    GET = "get",
    POST = "post",
    PUT = "put",
    DELETE = "delete",
    PATCH = "patch",
}