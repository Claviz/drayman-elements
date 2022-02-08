export interface DraymanNebula {
    /**
     * Executed when user makes selections.
     */
    onSelections?: ElementEvent<{ selections: any, method: 'selectHyperCubeValues' | 'rangeSelectHyperCubeValues' }>;
    /**
     * Executed when viz method must be called.
     */
    onVizMethod?: ElementEvent<{ args: any, name: 'getEffectiveProperties' | 'getHyperCubeReducedData' | 'getHyperCubeData' }>;
    /**
     * Executed when measure needs to be returned
     */
    onGetMeasure?: ElementEvent<{ measureId: string; }>;
    /**
     * Executed when object needs to be returned
     */
    onGetObject?: ElementEvent<{ objectId: string; }>;
    /**
     * Initial qLayout of the object to render.
     */
    qLayout: any;
}