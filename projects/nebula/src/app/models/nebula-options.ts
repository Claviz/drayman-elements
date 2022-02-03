export interface DraymanNebula {
    /**
     * Executed when user makes selections.
     */
    onSelections?: ElementEvent<{ value: { selections: any, method: 'selectHyperCubeValues' | 'rangeSelectHyperCubeValues' } }>;
    /**
     * Executed when viz method must be called.
     */
    onVizMethod?: ElementEvent<{ value: { args: any, name: 'getEffectiveProperties' | 'getHyperCubeReducedData' | 'getHyperCubeData' } }>;
    /**
     * Executed when measure needs to be returned
     */
    onGetMeasure?: ElementEvent<{ value: { measureId: string; } }>;
    /**
     * Executed when object needs to be returned
     */
    onGetObject?: ElementEvent<{ value: { objectId: string; } }>;
    /**
     * Initial qLayout of the object to render.
     */
    qLayout: any;
}