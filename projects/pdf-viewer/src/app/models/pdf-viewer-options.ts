/**
 * # drayman-pdf-viewer
 * 
 * PDF viewer powered by [ng2-pdf-viewer](https://github.com/VadimDez/ng2-pdf-viewer) library.
 *
 * ## Example of usage
 * 
 * ### PDF viewer displaying all pages
 *
 * ![](media://drayman-pdf-viewer-scroll.gif)
 *
 * ```typescript
 * module.exports = async () => {
 * 
 *     return () => <drayman-pdf-viewer
 *         key="pdf"
 *         style={{ height: '100%' }}
 *         src="https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf"
 *     />;
 * }
 * ```
 * 
 * ### PDF viewer displaying each page separately
 * 
 * ![](media://drayman-pdf-viewer-paginated.gif)
 * 
 * ```typescript
 * module.exports = async ({ forceUpdate }) => {
 *     let page = 1;
 *     const pageCount = 3;
 * 
 *     const wrapperStyle: CSS = {
 *         display: 'flex',
 *         'flex-direction': 'column',
 *         height: '100%'
 *     }
 * 
 *     const onPageChange = async (step) => {
 *         if (page + step >= 1 && page + step <= pageCount) {
 *             page += step;
 *             await forceUpdate();
 *         }
 *     }
 * 
 *     return () => {
 *         const prevPageBtn: DraymanButton = {
 *             label: 'Previous page',
 *             disabled: page === 1,
 *             onClick: onPageChange.bind(this, -1),
 *         }
 * 
 *         const nextPageBtn: DraymanButton = {
 *             label: 'Next page',
 *             disabled: page === pageCount,
 *             onClick: onPageChange.bind(this, 1),
 *         }
 * 
 *         return (
 *             <container key="wrapper" style={wrapperStyle}>
 *                 <container key="actions" style={{ display: 'flex' }}>
 *                     <drayman-button key="prevPage" {...prevPageBtn} />
 *                     <drayman-button key="nextPage" {...nextPageBtn} />
 *                 </container>
 *                 <drayman-pdf-viewer
 *                     style={{ overflow: 'auto' }}
 *                     key="pdf"
 *                     src="https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf"
 *                     page={page}
 *                 />
 *             </container>
 *         );
 *     };
 * }
 * ```
 */
export interface DraymanPdfViewer {
    /**
     * URL of the PDF.
     */
    src: string;
    /**
     * Shows a single page if specified. 
     * Otherwise all pages will be shown.
     */
    page?: number;
}
