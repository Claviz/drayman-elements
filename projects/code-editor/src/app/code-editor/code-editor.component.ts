import { AfterViewInit, Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { ResizedEvent } from 'angular-resize-event';

@Component({
  selector: 'drayman-code-editor-internal',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.scss'],
})
export class CodeEditorComponent implements OnChanges, AfterViewInit {
  @Input() language;
  @Input() label;
  @Input() disabled = false;
  @Input() readOnly = false;
  @Input() value?: string;
  @Input() onValueChange?: (data: { value: string; }) => Promise<void>;
  @Input() getSelectionValue?= () => {
    return this.ref.codeMirror.getSelection();
  }

  @ViewChild('CodeMirror') ref: any

  options: any = {
    lineNumbers: true,
    mode: 'javascript',
    gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter', 'CodeMirror-lint-markers'],
    foldGutter: true,
    foldgutter: true,
    matchBrackets: true,
    autoCloseBrackets: true,
    lint: {
      esversion: 9,
      selfContain: true
    },
  };
  focused = false;
  editorValue;

  constructor() {
  }

  ngAfterViewInit() {
    this.ref.codeMirror.setOption("extraKeys", {
      'Shift-Alt-F': (cm) => {
        const totalLines = this.ref.codeMirror.lineCount();
        const currentCursor = cm.getCursor();
        this.ref.codeMirror.autoFormatRange({ line: 0, ch: 0 }, { line: totalLines });
        cm.setCursor(currentCursor);
      }
    });
    this.ref.codeMirror.on('focus', () => {
      this.focused = true;
    });
    this.ref.codeMirror.on('blur', () => {
      this.focused = false;
    });
    // // get selected text on selection end:
    // this.ref.codeMirror.on('cursorActivity', (x) => {
    //   console.log(x, this.ref.codeMirror.getSelection());
    // });


  }

  onChange(value: string) {
    this.onValueChange?.({ value });
  }

  onResized(event: ResizedEvent) {
    this.ref?.codeMirror?.setSize?.(event.newWidth, event.newHeight - (this.label ? 25 : 0));
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.disabled || changes.readOnly) {
      this.options = JSON.parse(JSON.stringify({
        ...this.options,
        readOnly: this.disabled || this.readOnly,
      }));
    }
    if (changes.language) {
      let language = this.language;
      if (language === 'json') {
        language = { name: 'javascript', json: true }
      }
      if (language === 'html') {
        language = 'htmlmixed';
      }
      this.options = JSON.parse(JSON.stringify({
        ...this.options,
        mode: language,
      }));
    }
    if (changes.value && !this.focused) {
      this.editorValue = !this.value ? '' : this.value;
    }
  }
}
