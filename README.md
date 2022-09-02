<!-- [![Build Status](https://travis-ci.org/Claviz/drayman-elements.svg?branch=master)](https://travis-ci.org/Claviz/drayman-elements)
[![codecov](https://codecov.io/gh/Claviz/drayman-elements/branch/master/graph/badge.svg)](https://codecov.io/gh/Claviz/drayman-elements)
![npm](https://img.shields.io/npm/v/drayman-elements.svg) -->

# @drayman/elements

[Docs](https://drayman-elements.netlify.app/)

Default drayman elements library.

## Available elements

- [drayman-button](interfaces/__global.draymanbuttonprops.html)
- [drayman-menu](interfaces/__global.draymanmenuprops.html)
- [drayman-checkbox](interfaces/__global.draymancheckboxprops.html)
- [drayman-claviz-charts](interfaces/__global.draymanclavizchartsprops.html)
- [drayman-datepicker](interfaces/__global.draymandatepickerprops.html)
- [drayman-file-uploader](interfaces/__global.draymanfileuploaderprops.html)
- [drayman-ngx-charts](interfaces/__global.draymanngxchartsprops.html)
- [drayman-ngx-graph](interfaces/__global.draymanngxgraphprops.html)
- [drayman-number-field](interfaces/__global.draymannumberfieldprops.html)
- [drayman-pdf-viewer](interfaces/__global.draymanpdfviewerprops.html)
- [drayman-radio-group](interfaces/__global.draymanradiogroupprops.html)
- [drayman-select](interfaces/__global.draymanselectprops.html)
- [drayman-table](interfaces/__global.draymantableprops.html)
- [drayman-text-field](interfaces/__global.draymantextfieldprops.html)
- [drayman-textarea-field](interfaces/__global.draymantextareafieldprops.html)
- [drayman-timepicker](interfaces/__global.draymantimepickerprops.html)
- [drayman-youtube-player](interfaces/__global.draymanyoutubeplayerprops.html)
- [drayman-grid](interfaces/__global.draymangridprops.html)
- [drayman-nebula](interfaces/__global.draymannebulaprops.html)
- [drayman-code-editor](interfaces/__global.draymancodeeditorprops.html)
- [drayman-calendar](interfaces/__global.draymancalendarprops.html)

## Installing

Add Drayman Elements to your Drayman project:

```bash
npm install @drayman/elements@latest
```

Add required scripts to `public/index.html` header:

```html
<link
  rel="stylesheet"
  href="https://unpkg.com/@angular/material@12.2.4/prebuilt-themes/indigo-pink.css"
/>
<script src="https://unpkg.com/zone.js@0.11.4/dist/zone.min.js"></script>
```

Use Drayman Elements inside component script:

```tsx
export const component: DraymanComponent = async ({ forceUpdate }) => {
  let counter = 0;

  return () => {
    return (
      <div>
        <drayman-button
          label="Click me"
          onClick={async () => {
            counter++;
            await forceUpdate();
          }}
        />
        <p>Button was clicked {counter} times</p>
      </div>
    );
  };
};
```

## Development

### Adding new Drayman Element

1. Run command:

```bash
sudo npm run create-element -- %%element-name-in-kebab-case%% %%ElementNameInPascalCase%%
```

2. Update `package.json` with `scripts` and `drayman`.

3. Update `tsconfig.json` with `inputFiles`.
