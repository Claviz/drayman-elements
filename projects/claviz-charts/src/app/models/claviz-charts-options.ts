import { ContainerChartOptions } from 'claviz-charts/lib/models/container-chart-options';

/**
 * # drayman-claviz-charts
 * 
 * Charts powered by [claviz-charts](https://github.com/Claviz/claviz-charts) library.
 * 
 * ## Example of usage
 *
 * ![](media://drayman-claviz-charts.gif)
 *
 * ```typescript
 * module.exports = async ({ forceUpdate }) => {
 * 
 *     let selected: { value: number; label: string; };
 * 
 *     return () => {
 *         const onClick = async (data) => {
 *             selected = data;
 *             await forceUpdate();
 *         }
 * 
 *         const options: DraymanClavizCharts = {
 *             data: [
 *                 {
 *                     color: 'black',
 *                     label: 'Fruits',
 *                     data: [
 *                         {
 *                             value: 10,
 *                             label: 'Apples',
 *                             color: 'green'
 *                         },
 *                         {
 *                             value: 5,
 *                             label: 'Oranges',
 *                             color: 'orange'
 *                         }
 *                     ]
 *                 },
 *                 {
 *                     color: 'black',
 *                     label: 'Vegetables',
 *                     data: [
 *                         {
 *                             value: 12,
 *                             label: 'Tomatoes',
 *                             color: 'red'
 *                         },
 *                     ]
 *                 }
 *             ],
 *             onClick,
 *         }
 * 
 *         return [
 *             <drayman-claviz-charts key="chart" {...options} style={{ height: '200px' }} />,
 *             selected &&
 *             <html key="info">
 *                 <p>You have selected {selected.value} {selected.label}!</p>
 *             </html>
 *         ]
 *     }
 * }
 * ```
 */
export interface DraymanClavizCharts extends ContainerChartOptions {
    /**
     * Function that will be executed when user clicks a chart element.
     */
    onClick?: (data: any) => Promise<void>;
    /**
     * @ignore
     */
    select?: never;
}