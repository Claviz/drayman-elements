export interface DraymanNebula {
    /**
     * Qlik URL configuration.
     */
    configuration: {
        host?: string;
        port?: number;
        /**
         * Set to false to use an unsecure WebSocket connection (`ws://`).
         */
        secure?: boolean;
        /**
         * Additional parameters to be added to WebSocket URL (for example, `qlikTicket`).
         */
        urlParams?: any;
        /**
         * Absolute base path to use when connecting, used for proxy prefixes.
         */
        prefix?: string;
        /**
         * The ID of the app intended to be opened in the session.
         */
        appId?: string;
        /**
         * Initial route to open the WebSocket against, default is `app/engineData`.
         */
        route?: string;
        /**
         * Subpath to use, used to connect to dataprepservice in a server environment.
         */
        subpath?: string;
        /**
         * Identity (session ID) to use.
         */
        identity?: string;
        /**
         * A value in seconds that QIX Engine should keep the session alive after socket disconnect (only works if QIX Engine supports it).
         */
        ttl?: number;
    };
    /**
     * Existing visualization ID to render.
     */
    vizId: string;
    /**
    * Whether to show selections toolbar or not.
    */
    showToolbar: boolean;
}