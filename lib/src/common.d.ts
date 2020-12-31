interface CloudInfoParams {
    readonly appid: string;
    readonly secret: string;
    readonly env: string;
}
export interface CommonResponse {
    readonly errcode: number;
    readonly errmsg: string;
}
export declare function checkEnv(): boolean;
export declare function setEnvironment(cloudInfoParams: CloudInfoParams): void;
export declare function getToken(): Promise<string>;
export interface RemoteCallParams {
    readonly url: string;
    readonly [query: string]: any;
    readonly data: object;
    readonly cb?: Function;
}
export declare function remoteCall(params: RemoteCallParams): Promise<unknown>;
export {};
