import { ButtonOptionsBase } from '../../../../shared/models/button-options-base';

/**
 * # drayman-menu
 * 
 * Menu powered by [Angular Material](https://material.angular.io/) library.
 *
 * ## Example of usage
 * 
 * ![](media://drayman-menu.gif)
 * 
 * ```typescript
 * import axios from 'axios';
 * 
 * module.exports = async ({ $meta, forceUpdate }) => {
 *     let selectedImg;
 *     let selectedBreed;
 *     const dogBreeds = (await axios.get(`https://dog.ceo/api/breeds/list/all`)).data.message;
 *     const items: DraymanMenuItem[] = Object
 *         .keys(dogBreeds)
 *         .map(x => ({
 *             label: x,
 *             breed: x,
 *             items: dogBreeds[x].map(xx => ({ label: xx, breed: `${x}/${xx}` })),
 *         }));
 * 
 *     const onItemClick = async ({ item }) => {
 *         selectedImg = (await axios.get(`https://dog.ceo/api/breed/${item.breed}/images/random`)).data.message;
 *         selectedBreed = item.breed;
 *         await forceUpdate();
 *     }
 * 
 *     return () => {
 *         return ([
 *             <drayman-menu key="dog-menu" label={`${selectedBreed || 'Dog'}`} items={items} onItemClick={onItemClick} />,
 *             selectedImg && <html key="info">
 *                 <img src={selectedImg} style={{ width: '350px', height: 'auto' }} />
 *             </html>
 *         ]);
 *     }
 * }
 * ```
 */
export interface DraymanMenu extends ButtonOptionsBase {
    /**
     * Menu item list.
     */
    items: DraymanMenuItem[];
    /**
     * Executed when user clicks a menu item.
     */
    onItemClick?: ({ item: DraymanMenuItem }) => Promise<void>;
}

export interface DraymanMenuItem {
    /**
     * Item label.
     */
    label?: string;
    /**
     * Icon displayed before label text.
     */
    icon?: string;
    /**
     * Whether item disabled or not.
     */
    disabled?: boolean;
    /**
     * Menu item list.
     */
    items?: DraymanMenuItem[];
}
