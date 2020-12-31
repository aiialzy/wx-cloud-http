export declare function uploadFile(src: string, dest: string): Promise<unknown>;
declare type Filter = (p: string) => boolean;
export declare function uploadDir(src: string, dest?: string, filter?: Filter): Promise<unknown>;
export declare function deleteFiles(fileid_list: [string]): Promise<unknown>;
interface CloudFileDownloadInfo {
    fileid: string;
    max_age: number;
}
export declare function download(file_list: Array<CloudFileDownloadInfo>, dir?: string): Promise<unknown>;
export {};
