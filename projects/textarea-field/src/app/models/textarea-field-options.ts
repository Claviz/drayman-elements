import { InputFieldOptionsBase } from '../../../../shared/models/input-field-options-base';

/**
 * # drayman-textarea-field
 * 
 * Textarea field powered by [Angular Material](https://material.angular.io/) library.
 *
 * ## Example of usage
 * 
 * ![](media://drayman-textarea-field.gif)
 * 
 * ```typescript
 * module.exports = async ({ forceUpdate }) => {
 *     let text = 'Hello, <b>world</b>!';
 * 
 *     const onValueChange = async ({ value }) => {
 *         text = value;
 *         await forceUpdate();
 *     }
 * 
 *     return () => {
 *         return [
 *             <drayman-textarea-field
 *                 key="default-textarea-field"
 *                 label="Text"
 *                 onValueChange={onValueChange}
 *                 value={text}
 *             />,
 *             <html key="text">{text && <p>{text}</p>}</html>
 *         ]
 *     };
 * }
 * ```
 */
export interface DraymanTextareaField extends InputFieldOptionsBase<string> {
    /**
     * The number of visible text lines for the control.
     */
    rows?: number;
}
