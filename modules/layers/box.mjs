import Layer from './base.mjs';
import {rgbToHex, hexToRgb} from '../units.mjs';

export default function BoxLayer(_options={}) {
    let {
        fillStyle = "#000000",
        strokeStyle = "#000000",
        pattern = "block",
        lineWidth = 2,
        actions = ["stroke", "fill"],
        ...options
    } = _options;

    function render(_, ctx) {
        if(pattern === "diagonals") {
            const cm = Math.max(ctx.canvas.width, ctx.canvas.height);
            const grad = ctx.createLinearGradient(0, 0, cm, cm);
        
            const freq = cm * Math.sqrt(2) / 30;
            const offset = 1 / freq;

            let flip = false;
            for(let i=0; i < 1.0; i += offset) {
                if(flip) {
                    grad.addColorStop(i, 'transparent');
                    grad.addColorStop(Math.min(1, i + 0.1 * offset), fillStyle);
                } else {
                    grad.addColorStop(Math.max(0, i - 0.1 * offset), fillStyle);
                    grad.addColorStop(i, 'transparent');
                }
                flip = !flip;
            }

            ctx.fillStyle = grad;
        } else if(fillStyle !== undefined) {
            ctx.fillStyle = fillStyle;
        }

        if(strokeStyle !== undefined) {
            ctx.strokeStyle = strokeStyle;
        }

        if(lineWidth !== undefined) {
            ctx.lineWidth = lineWidth;
        }

        actions.forEach(function(action) {
            if(action === "stroke") {
                ctx.strokeRect(lineWidth, lineWidth, ctx.canvas.width - lineWidth, ctx.canvas.height - lineWidth);
            } else if(action === "fill") {
                ctx.fillRect(lineWidth, lineWidth, ctx.canvas.width - lineWidth, ctx.canvas.height - lineWidth);
            } else if(action === "clear") {
                ctx.clearRect(lineWidth, lineWidth, ctx.canvas.width - lineWidth, ctx.canvas.height - lineWidth);
            }
        });
    }

    function setFill(col) {
        actions = actions.filter(function (v) {
            return v !== "fill";
        }).concat(["fill"]);
        fillStyle = col;
    }

    function setStroke(col) {
        actions = actions.filter(function (v) {
            return v !== "stroke";
        }).concat(["stroke"]);
        strokeStyle = col;
    }

    return new Layer({
        label: "Box",
        tools: [{
            label: "fill-color",
            input: {
                type: "color",
            },
            get: function() { return fillStyle; },
            set: function(v) { return setFill(v); },
        }, {
            label: "stroke",
            input: {
                type: "color",
            },
            get: function() { return strokeStyle; },
            set: setStroke,
        }, {
            label: "line width",
            input: {
                type: "number",
                min: 0
            },
            get: function() { return lineWidth; },
            set: function(v) { lineWidth = parseFloat(v);}
        }],
        render,
        ...options
    });
}