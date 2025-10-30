import { ButtonOptionsBase } from '../../../../shared/models/button-options-base';

export interface DraymanMenu extends ButtonOptionsBase {
    /**
     * Menu item list.
     */
    items: DraymanMenuItem[];
    /**
     * Executed when user clicks a menu item.
     */
    onItemClick?: ElementEvent<{ item: DraymanMenuItem }>;
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
    iconStyle?: any;
    itemStyle?: any;
    /**
     * Whether item disabled or not.
     */
    disabled?: boolean;
    /**
     * Menu item list.
     */
    items?: DraymanMenuItem[];
}
