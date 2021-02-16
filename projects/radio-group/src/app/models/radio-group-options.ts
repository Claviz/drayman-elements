import { SelectOption } from '../../../../select/src/app/models/select-options';
import { FieldOptionsBase } from '../../../../shared/models/field-options-base';

/**
 * # drayman-radio-group
 * 
 * Radio button powered by [Angular Material](https://material.angular.io/) library.
 *
 * ## Example of usage
 * 
 * ![](media://drayman-radio-group.gif)
 * 
 * ```typescript
 * module.exports = async ({ forceUpdate }) => {
 *     let favSeason;
 *     let favAnimal;
 * 
 *     const onSeasonChange = async ({ value }) => {
 *         favSeason = value;
 *         await forceUpdate();
 *     }
 * 
 *     const onAnimalChange = async ({ value }) => {
 *         favAnimal = value;
 *         await forceUpdate();
 *     }
 * 
 *     return () => {
 *         const seasonRadioGroup: DraymanRadioGroup = {
 *             options: [{
 *                 label: 'Winter',
 *                 value: 'winter'
 *             }, {
 *                 label: 'Spring',
 *                 value: 'spring'
 *             }, {
 *                 label: 'Summer',
 *                 value: 'summer'
 *             }, {
 *                 label: 'Autumn',
 *                 value: 'autumn'
 *             }],
 *             label: 'Pick your favorite season',
 *             onValueChange: onSeasonChange,
 *             value: favSeason,
 *         }
 * 
 *         const animalRadioGroup: DraymanRadioGroup = {
 *             options: [{
 *                 label: 'Dog',
 *                 value: 'dog'
 *             }, {
 *                 label: 'Cat',
 *                 value: 'cat'
 *             }],
 *             label: 'Pick your favorite animal',
 *             direction: 'row',
 *             onValueChange: onAnimalChange,
 *             value: favAnimal,
 *         }
 * 
 *         return [
 *             <drayman-radio-group key="season" {...seasonRadioGroup} />,
 *             <drayman-radio-group key="animal" {...animalRadioGroup} />,
 *             <html key="info">
 *                 {favSeason && <p>Your favorite season is {favSeason}.</p>}
 *                 {favAnimal && <p>Your favorite animal is {favAnimal}.</p>}
 *             </html>
 *         ];
 *     };
 * }
 * ```
 */
export interface DraymanRadioGroup extends FieldOptionsBase<string> {
    /**
     * Array of radio button options.
     */
    options?: SelectOption[];
    /**
     * Direction of option list.
     * `column` by default.
     */
    direction?: 'column' | 'row';
    /**
    * @ignore
    */
    placeholder?: never;
}
