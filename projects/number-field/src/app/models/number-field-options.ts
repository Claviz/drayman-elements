import { InputFieldOptionsBase } from '../../../../shared/models/input-field-options-base';
import { AutocompleteOptionsBase } from '../../../../shared/models/autocomplete-options-base';

/**
 * # drayman-number-field
 *
 * Number field powered by [Angular Material](https://material.angular.io/) library.
 *
 * ## Example of usage
 *
 * ![](media://drayman-number-field.gif)
 *
 * ```typescript
 * module.exports = async ({ forceUpdate }) => {
 *     let celsius;
 *     let fahrenheit;
 *     let typing = false;
 * 
 *     // User started typing
 *     const onValueChangeStart = async () => {
 *         typing = true;
 *         await forceUpdate();
 *     }
 * 
 *     // User stopped typing with some `value`
 *     const onValueChange = async ({ value }) => {
 *         typing = false;
 *         fahrenheit = value;
 *         celsius = (value - 32) / 1.8;
 *         await forceUpdate();
 *     }
 * 
 *     return () => {
 * 
 *         return [
 *             <drayman-number-field
 *                 value={fahrenheit}
 *                 key="fahrenheit"
 *                 label="Temperature in Fahrenheit (°F)"
 *                 onValueChangeStart={onValueChangeStart}
 *                 onValueChange={onValueChange}
 *             />,
 *             <html key="info">
 *                 {celsius && <p>{fahrenheit}°F = {celsius}°C</p>}
 *                 <p>{typing ? `You are typing!` : `You aren't typing!`}</p>
 *             </html>
 *         ]
 *     };
 * }
 * ```
 */
export interface DraymanNumberField extends AutocompleteOptionsBase<number> {
}