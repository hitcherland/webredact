import Layer from './base.mjs';
import {filters} from '../filters.mjs';

export default function ScatterLayer(_options={}) {
    let {
        dx = 1,
        dy = 1,
        softness = 0.0,
        ...options
    } = _options;

    function render(topCtx, ctx) {
        const im = topCtx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.putImageData(im, 0, 0);
        filters.Scatter(ctx, dx, dy, softness);
    }

    const layer = new Layer({
        label: "Scatter",
        selectable: false,
        tools: [{
            label: "x scatter",
            icon: "icons/tool-scatter-x.svg",
            input: {
                type: "number",
                min: 0,
                size: 1,
            },
            get: function() { return dx; },
            set: function(v) { dx = parseFloat(v); }
        }, {
            label: "y scatter",
            icon: "icons/tool-scatter-y.svg",
            input: {
                type: "number",
                min: 0,
            },
            get: function() { return dy; },
            set: function(v) { dy = parseFloat(v); }
        }, {
            label: "softness",
            input: {
                type: "number",
                min: 0,
                max: 2,
                step: 0.1,
            },
            get: function() { return softness; },
            set: function(v) { softness = parseFloat(v);}
        }],
        render,
        ...options
    });
    return layer;
}