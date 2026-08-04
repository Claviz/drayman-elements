/**
 * Requires the host environment to initialize Monaco on `window.monaco`
 * before creating a `drayman-code-editor` element.
 */
export interface DraymanCodeEditor {
    /**
     * The language of the code editor.
     * By default, the language is set to 'javascript'.
     */
    language?: 'javascript' | 'json' | 'sql' | 'python' | 'markdown' | 'html' | any;
    /**
     * Wether code editor should be disabled.
     */
    disabled?: boolean;
    /**
     * Wether code editor should be read only.
     */
    readOnly?: boolean;
    /**
     * Value of the code editor.
     */
    value?: string;
    /**
     * Executed with an input value from user.
     */
    onValueChange?: ElementEvent<{ value: string }>;
    /**
     * Executed when the browser-side editor is ready.
     */
    onReady?: ElementEvent<{}>;
    /**
     * Label shown above the editor.
     */
    label?: string;
}
