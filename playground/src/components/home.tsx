export const component: DraymanComponent = async ({ forceUpdate }) => {

    return () => {

        return (
            <drayman-calendar
                events={[
                    {
                        title: 'Event 1',
                        start: new Date().toISOString(),
                        end: new Date('2023-01-01').toISOString(),
                        id: 'event_1',
                        color: 'blue',
                    }
                ]}
                onEventClick={async ({ id }) => {
                    console.log(id);
                }}
                onDayClick={async ({ date }) => {
                    console.log(date);
                }}
            />
        );
    }
}