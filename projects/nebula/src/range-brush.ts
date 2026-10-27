// Picasso's discrete range brush (brush-area-dir) sets the selection to the values under the ranges
// drawn since the chart last redrew. Scrolling redraws the chart, so a range drawn after scrolling
// drops earlier ranges, and a range also drops bars selected by tapping. Nebula chart bundles are
// patched on load so a range drag keeps the values its ranges don't cover.

// The range drag's brush call, as minified in the Nebula chart bundles.
const rangeBrushCall = 'function(e,t){e.chart.brushFromShapes(t,e.settings.brush)}';

export const rangeBrushGlobals = { draymanBrushFromRanges: brushFromRanges };

// Bundles without the call (other versions or chart types) load unchanged.
export function patchRangeBrush(source: string) {
  return source.split(rangeBrushCall).join('draymanBrushFromRanges');
}

function brushValues(brush) {
  return [].concat(...brush.brushes()
    .filter(b => b.type === 'value')
    .map(b => b.brush.values().map(value => ({ key: b.id, value }))));
}

// Same area as the range brush uses for a range.
function rangeShapes(state, ranges) {
  const { chart, rect, direction } = state;
  return [].concat(...ranges.map(range => chart.shapesAt(direction
    ? { x: range.min + rect.x, y: rect.y, width: range.max - range.min, height: rect.height + rect.y }
    : { x: rect.x, y: range.min + rect.y, width: rect.width + rect.x, height: range.max - range.min },
    state.settings.brush)));
}

function brushFromRanges(state, shapes) {
  const { chart } = state;
  const config = state.settings.brush;
  const contexts: string[] = [...new Set<string>([].concat(...config.components.filter(c => c.action === 'set').map(c => c.contexts || [])))];
  // A single range replaces the selection by design.
  if (!state.multi || !contexts.length) return chart.brushFromShapes(shapes, config);
  const brushes = contexts.map(context => chart.brush(context));
  // A drag starts with a new active range. The ranges it started with are still in
  // state.ranges, and the selected values they don't cover are kept.
  if (state.keptFor !== state.active) {
    state.keptFor = state.active;
    const selected = brushes.map(brushValues);
    // The earlier ranges are applied without update events: Nebula sends the selection once,
    // with the result below. Other events, such as the start of a selection, still go out.
    const emits = brushes.map(brush => brush.emit);
    brushes.forEach((brush, i) => brush.emit = (event, ...args) => event === 'update' ? false : emits[i].call(brush, event, ...args));
    try {
      chart.brushFromShapes(rangeShapes(state, state.ranges || []), config);
      state.kept = brushes.map((brush, i) => selected[i].filter(item => !brush.containsValue(item.key, item.value)));
    } finally {
      brushes.forEach((brush, i) => brush.emit = emits[i]);
    }
  }
  const setValues = brushes.map(brush => brush.setValues);
  brushes.forEach((brush, i) => brush.setValues = items => setValues[i]([...items, ...state.kept[i]]));
  try {
    chart.brushFromShapes(shapes, config);
  } finally {
    brushes.forEach((brush, i) => brush.setValues = setValues[i]);
  }
}
