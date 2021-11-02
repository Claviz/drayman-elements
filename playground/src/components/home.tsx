export const component: DraymanComponent = async ({ forceUpdate }) => {
    let counter = 0;

    return () => {

        return (
            <div>
                <drayman-button
                    label="Click me"
                    onClick={async () => {
                        counter++;
                        await forceUpdate();
                    }}
                />
                <p>Button was clicked {counter} times</p>
            </div>
        );
    }
}
