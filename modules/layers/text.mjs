import Layer from './base.mjs';
import {createElement} from '../dom.mjs';
import {toCanvasPct, toCanvasPixel, toPixel, rgbToHex, hexToRgb} from '../units.mjs';

function parseFont(font) {
    const el = createElement('div', {
        style: {font},
    });

    return [
        "font-style",
        "font-weight",
        "font-size",
        "line-height",
        "font-family",
    ].reduce(function(o, k) {
        const v = el.attributeStyleMap.get(k);
        o[k] = v.toString();
        return o;
    }, {});
}

function unparseFont(map) {
    return `${map["font-style"]} ${map["font-weight"]} ${map["font-size"]}/${map["line-height"]} ${map["font-family"]}`;
}

const resizeObserver = new ResizeObserver(function(entries) {
    let hasChange = false;
    entries.forEach(function (entry) {
        const matches = TextLayer.instances.filter(function(v) {
            return v.input === entry.target;
        });

        if(entry.target.computedStyleMap().get("display").value === "none") {
            return;
        }

        const layer = matches[0];
        layer.setWidth(entry.contentRect.width + "px");
        layer.setHeight(entry.contentRect.height + "px");
        hasChange = true;
    });
    if(hasChange) {
        Redact.render();
    }
});

export default function TextLayer(options={}) {
    let {
        text,
        font = "24px/26px SpecialElite",
        fillStyle = "#000000",
        strokeStyle = "black",
        textAlign = "left",
        action = ["fill"],
        position = [0, 0],
        ...extras
    } = options;

    const fontBreakdown = parseFont(font);

    const input = createElement('textarea', {
        class: "text-edit",
        text,
        parent: document.body,
    });

    input.addEventListener('change', function() {
        console.log("change");
        Redact.render();
    });

    resizeObserver.observe(input);

    function updateFont() {
        font = unparseFont(fontBreakdown);
    }

    function render(topCtx, ctx, dps) {
        ctx.save();

        const rect = topCtx.canvas.getBoundingClientRect();
        const dx = rect.width / topCtx.canvas.width;
        const dy = rect.height / topCtx.canvas.height;


        const width = layer.getWidth();
        const h = toPixel(layer.getHeight(), "height");
        const w = toPixel(width, "width");

        ctx.font = font;
        
        input.style.font = font;

        let lineHeight = toPixel(fontBreakdown["line-height"], "width");

        if(fillStyle !== undefined) {
            ctx.fillStyle = fillStyle;
        }

        if(strokeStyle !== undefined) {
            ctx.strokeStyle = strokeStyle;
        }

        function getLines(ctx, text, maxWidth) {
            let tlines = text.split('\n');
            let lines = [];
        
            tlines.forEach(function(tline) {
                let words = tline.split(" ");
                let currentLine = words[0];

                for (let i = 1; i < words.length; i++) {
                    let word = words[i];
                    let width = ctx.measureText(currentLine + " " + word).width;
                    if (width < maxWidth) {
                        currentLine += " " + word;
                    } else {
                        lines.push(currentLine);
                        currentLine = word;
                    }
                }
                lines.push(currentLine);
            });
            return lines;
        }

        let maxWidth = toCanvasPixel(topCtx.canvas, width, "width");

        const lines = getLines(ctx, input.value, maxWidth);

        const measurement = ctx.measureText(text);
        let y = measurement.actualBoundingBoxAscent;

        lines.forEach(function(line, i) {
            action.forEach(function (mode) {
                let Y = y + i * lineHeight;
                if(Y > h) {
                    return;
                }
                let X = 0;
                if(textAlign === "right") {
                    const lineMeasurement = ctx.measureText(line);
                    X = width - lineMeasurement.width;
                } else if(textAlign === "center") {
                    const lineMeasurement = ctx.measureText(line);
                    X = (width - lineMeasurement.width) / 2;
                }

                if(mode === "stroke") {
                    ctx.strokeText(line, X, Y);
                } else if(mode === "fill") {
                    ctx.fillText(line, X, Y);
                }
            });
        });

        ctx.restore();
    }

    const tools = Object.keys(fontBreakdown).map(function (key) {
        return {
            label: key,
            get: function() { return fontBreakdown[key]; },
            set: function(v) { fontBreakdown[key] = v; updateFont(); }
        };
    });

    tools.push({
        label: "color",
        input: {
            type: "color",
        },
        get: function() { return fillStyle; },
        set: function(v) { fillStyle = v; }
    });

    const layer = new Layer({
        label: "Text",
        input,
        position,
        tools,
        render,
        ...extras
    });

    layer.editPseudo.appendChild(input);
    TextLayer.instances.push(layer);
    return layer;
}

TextLayer.instances = [];