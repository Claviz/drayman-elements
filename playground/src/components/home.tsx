export const component: DraymanComponent = async ({ forceUpdate }) => {

    let currentValue = 0;

    return () => {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', flexDirection: 'column' }}>
                <drayman-slider
                    onValueChange={async ({ value }) => {
                        currentValue = value;
                        await forceUpdate();
                    }}
                    enableThumbLabel
                    color="orange"
                    alwaysOnThumb
                    min={-1000}
                    max={1000}
                    value={currentValue}
                />
                <div>Current value on server: {currentValue}</div>
            </div>
        );
    }
}