
import Layer from './base.mjs';
import {filters} from '../filters.mjs';
import {rgbToHex, hexToRgb} from '../units.mjs';

export default function RGBANoiseLayer(_options={}) {
    let {
        minRGBA = [0.0, 0.0, 0.0, 1.0],
        maxRGBA = [1.0, 1.0, 1.0, 1.0],
        ...options
    } = _options;

    function render(_, ctx) {
        filters.RGBANoise(ctx, minRGBA, maxRGBA);
    }

    return new Layer({
        label: "Noise",
        tools: [{
            label: "minimum RGB",
            input: {
                type: "color",
            },
            get: function() { return rgbToHex(...minRGBA); },
            set: function(v) { const col = hexToRgb(v); [minRGBA[0], minRGBA[1], minRGBA[2]] = col; }
        }, {
            label: "minimum Alpha",
            input: {
                type: "number",
                min: 0,
                max: 1,
                step: 0.01,
            },
            get: function() { return minRGBA[3]; },
            set: function(v) { minRGBA[3] = parseFloat(v); }
        }, {
            label: "maximum RGB",
            input: {
                type: "color",
            },
            get: function() { return rgbToHex(...maxRGBA); },
            set: function(v) { const col = hexToRgb(v); [maxRGBA[0], maxRGBA[1], maxRGBA[2]] = col; }
        }, {
            label: "maximum Alpha",
            input: {
                type: "number",
                min: 0,
                max: 1,
                step: 0.01,
            },
            get: function() { return maxRGBA[3]; },
            set: function(v) { maxRGBA[3] = parseFloat(v); }
        }],
        render,
        ...options
    });
}