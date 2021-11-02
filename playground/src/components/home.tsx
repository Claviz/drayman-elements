
export const component: DraymanComponent = async ({ forceUpdate, Browser }) => {

    let startDate;
    let endDate;
    const allowedDates = [];
    for (let i = 10; i < 25; i++) {
        allowedDates.push(`2021-07-${i}`);
    }
    let minEndDate;
    let maxStartDate;

    return () => {
        return (
            <div>
                <div style={{ display: 'flex', gap: '5px' }}>
                    <drayman-datepicker
                        value={startDate}
                        ref="startDate"
                        allowedDates={allowedDates}
                        maxDate={maxStartDate}
                        label="Start date"
                        onValueChange={async ({ value }) => {
                            startDate = value;
                            minEndDate = startDate;
                            await forceUpdate();
                            await Browser.moveCalendarTo({ date: startDate }, ['endDate']);
                        }}
                    />
                    <drayman-datepicker
                        value={endDate}
                        ref="endDate"
                        allowedDates={allowedDates}
                        minDate={minEndDate}
                        label="End date"
                        onValueChange={async ({ value }) => {
                            endDate = value;
                            maxStartDate = endDate;
                            await forceUpdate();
                            await Browser.moveCalendarTo({ date: endDate }, ['startDate']);
                        }}
                    />
                </div>
                {
                    JSON.stringify({ startDate, endDate })
                }
            </div>
        )
    }
}