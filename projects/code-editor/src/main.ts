
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { CodeEditorModule } from './app/app.module';
import { environment } from './environments/environment';

import 'codemirror/mode/javascript/javascript';

import 'codemirror/mode/sql/sql';

import 'codemirror/addon/fold/foldcode';
import 'codemirror/addon/fold/brace-fold';
import 'codemirror/addon/fold/comment-fold';
import 'codemirror/addon/fold/indent-fold';
import 'codemirror/addon/fold/markdown-fold';
import 'codemirror/addon/fold/xml-fold';
import 'codemirror/addon/fold/foldgutter';

import 'codemirror/addon/search/search';
import 'codemirror/addon/search/searchcursor';

import 'codemirror/addon/dialog/dialog';

// import 'codemirror/addon/scroll/scrollpastend';

import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/edit/closebrackets';

import 'codemirror/addon/lint/lint';
import 'codemirror/addon/lint/javascript-lint';
import 'codemirror/addon/lint/json-lint';

import { JSHINT } from 'jshint';
(window as any).JSHINT = JSHINT;

import './codemirror-addons/json-lint';
import './codemirror-addons/auto-format';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(CodeEditorModule)
  .catch(err => console.log(err));