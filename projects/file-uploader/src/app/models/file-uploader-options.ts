/**
 * # drayman-file-uploader
 * 
 * File uploader powered by [FilePond](https://pqina.nl/filepond/) library.
 *
 * ## Example of usage
 *
 * ![](media://drayman-file-uploader.gif)
 *
 * ```typescript
 * module.exports = async ({ forceUpdate }) => {
 *     let file;
 * 
 *     // File has been uploaded
 *     const onUpload = async (_, files) => {
 *         file = files[0];
 *         await forceUpdate();
 *         return '123';
 *     }
 * 
 *     return () => [
 *         <drayman-file-uploader
 *             key="file-upload"
 *             onUpload={onUpload}
 *         />,
 *         <html key="info">
 *             {file &&
 *                 <img
 *                     src={`data:${file.mimeType};base64,${file.buffer.toString('base64')}`}
 *                     style={{ width: '200px;' }}
 *                 />
 *             }
 *         </html>
 *     ]
 * }
 * ```
 */
export interface DraymanFileUploader {
    /**
     * Array of files to show when uploader element appears.
     */
    initialFiles?: {
        /**
         * Unique file ID.
         */
        id: string;
        /**
         * Size of the file in bytes.
         */
        length: number;
        /**
         * Name of the uploaded file.
         */
        fileName: string;
        /**
         * URL that starts a download of this file.
         */
        downloadUrl: string;
    }[];
    /**
     * Wether multiple file upload is allowed or not.
     */
    allowMultiple?: boolean;
    /**
     * Executed when file is uploaded.
     * This function contains uploaded file and must return a unique file ID.
     * This unique ID is then used to revert uploads.
     */
    onUpload?: (data: undefined, files: (File | ClientFile)[]) => Promise<string>;
    /**
     * Executed when user wants to remove a file.
     * Receives unique file ID `fileId`.
     * This function is usually used to remove a specific file from file system.
     */
    onRemoveUploaded?: (data: { fileId: string }) => Promise<string>;
}

interface ClientFile {
    fieldName: string;
    file: any;
    fileName: string;
}

interface File {
    /** Name of the form field associated with this file. */
    fieldname: string;
    /** Name of the file on the uploader's computer. */
    originalname: string;
    /**
     * Value of the `Content-Transfer-Encoding` header for this file.
     */
    encoding: string;
    /** Value of the `Content-Type` header for this file. */
    mimetype: string;
    /** Size of the file in bytes. */
    size: number;
    /** A Buffer containing the entire file. */
    buffer: any;
}