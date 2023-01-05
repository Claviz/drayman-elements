export interface DraymanCodeEditor {
    /**
     * The language of the code editor.
     * By default, the language is set to 'javascript'.
     */
    language?: 'javascript' | 'json' | 'sql' | 'python' | 'markdown';
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
     * Label shown above the editor.
     */
    label?: string;
}