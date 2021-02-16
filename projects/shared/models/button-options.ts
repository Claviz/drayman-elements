import { ButtonOptionsBase } from './button-options-base';

/**
 * # drayman-button
 * Button powered by [Angular Material](https://material.angular.io/) library.
 *
 * ## Example of usage
 * 
 * ![](media://drayman-button.gif)
 *
 * ```typescript
 * module.exports = async ({ forceUpdate }) => {
 *     let counter = 0;
 * 
 *     // Button has been clicked
 *     const onClick = async () => {
 *         counter++;
 *         await forceUpdate();
 *     }
 * 
 *     return () => {
 * 
 *         return ([
 *             <drayman-button key="default-btn" label="Click me" onClick={onClick} />,
 *             <html key="info">
 *                 <p>Button was clicked {counter} times</p>
 *             </html>
 *         ]);
 *     }
 * }
 * ```
 */
export interface DraymanButton extends ButtonOptionsBase {
    /**
     * Executed when user clicks a button.
     */
    onClick?: () => Promise<void>;
}