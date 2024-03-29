export interface DraymanNgxGraph {
    /**
     * List of graph edges.
     */
    links?: any[];
    /**
     * List of graph nodes.
     */
    nodes?: any[];
    /**
     * List of cluster nodes.
     */
    clusters?: any;
    /**
     * Show/hide minimap.
     */
    showMiniMap?: boolean;
    /**
     * Enable dragging nodes.
     */
    draggingEnabled?: boolean;
    /**
     * Center the graph in the viewport when the graph is updated.
     */
    autoCenter?: boolean;
    /**
     * Automatically zoom the graph to fit in the avialable viewport when the graph is updated.
     */
    autoZoom?: boolean;
    /**
     * Executed when user clicks on a node.
     */
    onNodeClick?: ElementEvent<{ nodeId: any; }>;
    /**
     * Executed when user clicks on a link.
     * Emits IDs of the source and target nodes.
     */
    onLinkClick?: ElementEvent<{ sourceNodeId: any; targetNodeId: any; }>;
}
