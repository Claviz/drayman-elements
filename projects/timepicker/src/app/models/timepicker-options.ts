import { InputFieldOptionsBase } from '../../../../shared/models/input-field-options-base';

/**
 * # drayman-timepicker
 * 
 * Timepicker powered by [ngx-material-timepicker](https://github.com/Agranom/ngx-material-timepicker) library.
 *
 * ## Example of usage
 * 
 * ![](media://drayman-timepicker.gif)
 * 
 * ```typescript
 * import customParseFormat = require('dayjs/plugin/customParseFormat');
 * import dayjs from 'dayjs';
 * dayjs.extend(customParseFormat);
 * 
 * module.exports = async ({ forceUpdate }) => {
 *     const time: { start?: string; end?: string } = {};
 *     let timeLeft: { hours: number; minutes: number };
 * 
 *     const onTimeChange = async (timeType: 'start' | 'end', { value }) => {
 *         time[timeType] = value;
 *         if (time.start && time.end) {
 *             const start = dayjs(time.start, 'HH:mm');
 *             const end = dayjs(time.end, 'HH:mm');
 *             const diff = end.subtract(start);
 *             timeLeft = { hours: diff.hour(), minutes: diff.minute() };
 *             await forceUpdate();
 *         }
 *     }
 * 
 *     const wrapperStyle: CSS = {
 *         display: 'grid',
 *         'grid-auto-flow': 'column',
 *     }
 * 
 *     return () => {
 *         return [
 *             <container key="wrapper" style={wrapperStyle}>
 *                 <drayman-timepicker
 *                     key="start"
 *                     label="Start time"
 *                     onValueChange={onTimeChange.bind(this, 'start')}
 *                     value={time.start}
 *                 />
 *                 <drayman-timepicker
 *                     key="end"
 *                     label="End time"
 *                     onValueChange={onTimeChange.bind(this, 'end')}
 *                     showNowButton
 *                     value={time.end}
 *                 />
 *             </container>,
 *             <html key="info">
 *                 {timeLeft && <p>Time left: {timeLeft.hours} hours and {timeLeft.minutes} minutes.</p>}
 *             </html>
 *         ];
 *     }
 * }
 * ```
 */
export interface DraymanTimepicker extends InputFieldOptionsBase<string> {
    /**
     * Wether to show now button or not.
     */
    showNowButton?: boolean;
}
