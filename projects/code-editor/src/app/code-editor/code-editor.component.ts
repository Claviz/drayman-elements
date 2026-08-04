import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild } from '@angular/core';
import type * as Monaco from 'monaco-editor';

declare global {
  interface Window {
    monaco: typeof Monaco;
  }
}

@Component({
  selector: 'drayman-code-editor-internal',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.scss'],
})
export class CodeEditorComponent implements OnChanges, AfterViewInit, OnDestroy {
  @Input() language;
  @Input() label;
  @Input() disabled = false;
  @Input() readOnly = false;
  @Input() value?: string;
  @Input() onValueChange?: (data: { value: string; }) => Promise<void>;
  @Input() onReady?: () => Promise<void>;
  @Input() getSelectionValue = () => {
    const selection = this.editor?.getSelection();
    return selection ? this.editor.getModel()?.getValueInRange(selection) || '' : '';
  };

  @ViewChild('editorContainer') editorContainer: ElementRef<HTMLElement>;

  private monaco: typeof Monaco;
  private editor: Monaco.editor.IStandaloneCodeEditor;
  private model: Monaco.editor.ITextModel;
  private disposables: Monaco.IDisposable[] = [];
  private editorValue = '';
  private focused = false;
  private settingValue = false;
  private resizeObserver: ResizeObserver;
  private layoutFrame: number;

  constructor(elementRef: ElementRef<HTMLElement>) {
    const element = elementRef.nativeElement as HTMLElement & {
      getValue: () => string;
      setValue: (value: string) => void;
    };
    element.getValue = () => this.getValue();
    element.setValue = (value: string) => this.setValue(value);
  }

  ngAfterViewInit() {
    this.monaco = window.monaco;
    if (!this.monaco?.editor) {
      throw new Error('drayman-code-editor requires window.monaco to be initialized before the element is created.');
    }
    this.editor = this.monaco.editor.create(this.editorContainer.nativeElement, {
      value: this.editorValue,
      language: this.getLanguage(),
      automaticLayout: false,
      readOnly: this.disabled || this.readOnly,
      largeFileOptimizations: true,
      minimap: { enabled: false },
      wordWrap: 'off',
      scrollBeyondLastLine: false,
      folding: true,
      lineNumbers: 'on',
      matchBrackets: 'always',
      autoClosingBrackets: 'always',
      autoClosingQuotes: 'always',
    });
    this.model = this.editor.getModel();
    this.disposables.push(
      this.editor.onDidFocusEditorText(() => this.focused = true),
      this.editor.onDidBlurEditorText(() => this.focused = false),
      this.model.onDidChangeContent(() => {
        if (!this.settingValue && this.onValueChange) {
          this.editorValue = this.model.getValue();
          this.onValueChange?.({ value: this.editorValue });
        }
      }),
    );
    this.resizeObserver = new ResizeObserver(() => this.editor.layout());
    this.resizeObserver.observe(this.editorContainer.nativeElement);
    this.layoutFrame = requestAnimationFrame(() => this.editor.layout());
    void this.onReady?.();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.value && !this.focused) {
      this.editorValue = this.value || '';
      this.setValue(this.editorValue);
    }
    if (changes.language && this.model) {
      this.monaco.editor.setModelLanguage(this.model, this.getLanguage());
    }
    if ((changes.disabled || changes.readOnly) && this.editor) {
      this.editor.updateOptions({ readOnly: this.disabled || this.readOnly });
    }
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.layoutFrame);
    this.resizeObserver?.disconnect();
    this.disposables.forEach(disposable => disposable.dispose());
    this.editor?.dispose();
    this.model?.dispose();
  }

  private getLanguage() {
    if (!this.language) {
      return 'javascript';
    }
    if (this.language === 'html') {
      return 'html';
    }
    if (this.language.startsWith?.('handlebars')) {
      return 'handlebars';
    }
    if (this.language === 'raw') {
      return 'plaintext';
    }
    return this.language;
  }

  private getValue() {
    return this.model?.getValue() ?? this.editorValue;
  }

  private setValue(value: string) {
    this.editorValue = value || '';
    if (!this.model || this.model.getValue() === this.editorValue) {
      return;
    }
    this.settingValue = true;
    try {
      this.model.setValue(this.editorValue);
    } finally {
      this.settingValue = false;
    }
  }
}
