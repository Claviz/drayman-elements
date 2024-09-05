export const component: DraymanComponent = async ({ forceUpdate }) => {
    const data = [
        { name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
        { name: 'Helium', weight: 4.0026, symbol: 'He' },
        { name: 'Lithium', weight: 6.941, symbol: 'Li' },
        { name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
        { name: 'Boron', weight: 10.811, symbol: 'B' },
        { name: 'Carbon', weight: 12.0107, symbol: 'C' },
        { name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
        { name: 'Oxygen', weight: 15.9994, symbol: 'O' },
        { name: 'Fluorine', weight: 18.9984, symbol: 'F' },
        { name: 'Neon', weight: 20.1797, symbol: 'Ne' },
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

    let header = [
        {
            col: 0,
            row: 0,
            content: [{ type: 'text', value: 'name' }]
        },
        {
            col: 1,
            row: 0,
            content: [{ type: 'text', value: 'weight' }]
        },
        {
            col: 2,
            row: 0,
            content: [{ type: 'text', value: 'symbol' }]
        },
    ];
    header = header.map(x => ({ ...x, cellStyle: { position: 'sticky', backgroundColor: 'white', zIndex: 100, top: 0 } }));

    let grid = [];
console.log(matrix)
    const onScroll = ({ currentRow, visibleRowCount }) => {
        const visibleData = data.slice(currentRow, currentRow + visibleRowCount);
        const visibleGridData = visibleData.map((x, i) => ([
            {
                col: 0,
                row: currentRow + i + 1,
                content: [{ type: 'sparkline', value: { data: [matrix[0], matrix[0]].map(xx => ({ value: xx, tooltip: 'hi' })) }, }],
            },
            {
                col: 1,
                row: currentRow + i + 1,
                content: [{ type: 'text', value: x.weight }],
            },
            {
                col: 2,
                row: currentRow + i + 1,
                content: [{ type: 'text', value: x.symbol }],
            },
        ])).flat();
        grid = [
            ...header,
            ...visibleGridData,
        ];
    };

    onScroll({ currentRow: 0, visibleRowCount: 5 });

    return () => <drayman-grid
        grid={grid}
        cellHeight={30}
        cellWidth={180}
        columnCount={3}
        rowCount={data.length + 1}
        onScroll={async ({ currentRow, visibleRowCount }) => {
            onScroll({ currentRow, visibleRowCount });
            await forceUpdate();
        }}
    />;
}

const matrix = [
    [
        {
            "qText": "2023-4 (16.01)",
            "qNum": "NaN",
            "qElemNumber": 3
        },
        {
            "qText": "206.00",
            "qNum": 206,
            "qElemNumber": 0
        }
    ],
    [
        {
            "qText": "2023-6 (30.01)",
            "qNum": "NaN",
            "qElemNumber": 5
        },
        {
            "qText": "103.00",
            "qNum": 103,
            "qElemNumber": 0
        }
    ],
    [
        {
            "qText": "2023-7 (06.02)",
            "qNum": "NaN",
            "qElemNumber": 6
        },
        {
            "qText": "649.00",
            "qNum": 649,
            "qElemNumber": 0
        }
    ],
    [
        {
            "qText": "2023-28 (03.07)",
            "qNum": "NaN",
            "qElemNumber": 27
        },
        {
            "qText": "600.00",
            "qNum": 600,
            "qElemNumber": 0
        }
    ],
    [
        {
            "qText": "2024-5 (29.01)",
            "qNum": "NaN",
            "qElemNumber": 57
        },
        {
            "qText": "80.00",
            "qNum": 80,
            "qElemNumber": 0
        }
    ],
    [
        {
            "qText": "2024-7 (12.02)",
            "qNum": "NaN",
            "qElemNumber": 59
        },
        {
            "qText": "105.00",
            "qNum": 105,
            "qElemNumber": 0
        }
    ],
    [
        {
            "qText": "2024-18 (29.04)",
            "qNum": "NaN",
            "qElemNumber": 70
        },
        {
            "qText": "200.00",
            "qNum": 200,
            "qElemNumber": 0
        }
    ]
].map(x => x[1].qNum)