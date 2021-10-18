export const component: DraymanComponent = async ({ forceUpdate }) => {
    const data = [
        { name: { value: 'Carbon' }, weight: { value: 12.0107 }, symbol: { value: 'C' } },
        { name: { value: 'Hydrogen' }, weight: { value: 1.0079 }, symbol: { value: 'H' } },
        { name: { value: 'Fluorine' }, weight: { value: 18.9984 }, symbol: { value: 'F' } },
        { name: { value: 'Boron' }, weight: { value: 10.811 }, symbol: { value: 'B' } },
        { name: { value: 'Lithium' }, weight: { value: 6.941 }, symbol: { value: 'Li' } },
        { name: { value: 'Helium' }, weight: { value: 4.0026 }, symbol: { value: 'He' } },
        { name: { value: 'Neon' }, weight: { value: 20.1797 }, symbol: { value: 'Ne' } },
        { name: { value: 'Nitrogen' }, weight: { value: 14.0067 }, symbol: { value: 'N' } },
        { name: { value: 'Oxygen' }, weight: { value: 15.9994 }, symbol: { value: 'O' } },
        { name: { value: 'Beryllium' }, weight: { value: 9.0122 }, symbol: { value: 'Be' } },
    ];

    const columns = [{
        field: 'name',
        label: 'Name',
    }, {
        field: 'weight',
        label: 'Weight',
    }, {
        field: 'symbol',
        label: 'Symbol',
    }];

    return () => <drayman-table key="table" pagination sort search columns={columns} data={data} />;
}