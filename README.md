[![Build Status](https://travis-ci.org/Claviz/drayman-elements.svg?branch=master)](https://travis-ci.org/Claviz/drayman-elements)
[![codecov](https://codecov.io/gh/Claviz/drayman-elements/branch/master/graph/badge.svg)](https://codecov.io/gh/Claviz/drayman-elements)
![npm](https://img.shields.io/npm/v/drayman-elements.svg)

# drayman-elements

[Docs](https://drayman-elements.netlify.app/)

Default drayman elements library.

## Available elements
* [drayman-button](https://drayman-elements.netlify.app/interfaces/draymanbutton.html)
* [drayman-menu](https://drayman-elements.netlify.app/interfaces/draymanmenu.html)
* [drayman-checkbox](https://drayman-elements.netlify.app/interfaces/draymancheckbox.html)
* [drayman-claviz-charts](https://drayman-elements.netlify.app/interfaces/draymanclavizcharts.html)
* [drayman-datepicker](https://drayman-elements.netlify.app/interfaces/draymandatepicker.html)
* [drayman-file-uploader](https://drayman-elements.netlify.app/interfaces/draymanfileuploader.html)
* [drayman-ngx-charts](https://drayman-elements.netlify.app/interfaces/draymanngxcharts.html)
* [drayman-ngx-graph](https://drayman-elements.netlify.app/interfaces/draymanngxgraph.html)
* [drayman-number-field](https://drayman-elements.netlify.app/interfaces/draymannumberfield.html)
* [drayman-pdf-viewer](https://drayman-elements.netlify.app/interfaces/draymanpdfviewer.html)
* [drayman-radio-group](https://drayman-elements.netlify.app/interfaces/draymanradiogroup.html)
* [drayman-select](https://drayman-elements.netlify.app/interfaces/draymanselect.html)
* [drayman-table](https://drayman-elements.netlify.app/interfaces/draymantable.html)
* [drayman-text-field](https://drayman-elements.netlify.app/interfaces/draymantextfield.html)
* [drayman-textarea-field](https://drayman-elements.netlify.app/interfaces/draymantextareafield.html)
* [drayman-timepicker](https://drayman-elements.netlify.app/interfaces/draymantimepicker.html)

## Development

### Adding new drayman element

1. Run command:
```bash
sudo npm run create-element -- %%element-name-in-kebab-case%% %%ElementNameInPascalCase%%
```

2. Update `package.json` with `scripts` and `drayman`.

3. Update `tsconfig.json` with `inputFiles`.

4. Serve!