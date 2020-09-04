import {createElement} from './dom.mjs';
import templates from './templates.mjs';
import {toCanvasPct, toCanvasPixel, toPixel} from './units.mjs';

export default function Canvas(options={}) {
    let {
        element:canvas,
        background = "white",
        backgroundImage,
        layers = [],
        parent
    } = options;

    function exportPNG(filename="redacted") {
        let dataUrl = canvas.toDataURL("image/png");
        let a = createElement('a', {
            href: dataUrl,
            download: filename,
            parent: document.body
        });
        a.click();
        document.body.removeChild(a);
    }

    function render() {
        //ctx.rotate(0.5 * Math.PI / 180);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        layers.forEach(function(layer) {
            const cnv = layer.canvas;
            const [X, Y] = layer.getPosition();
            const x = toCanvasPixel(canvas, X, "width");
            const y = toCanvasPixel(canvas, Y, "height");

            layer.render(ctx);
            ctx.save();
            ctx.globalCompositeOperation = layer.blendMode;
            ctx.drawImage(cnv, x, y);
            ctx.restore();
        });
    }

    function renderLayer(layer) {
        const index = layers.indexOf(layer);
        if(layer < 0) {
            return;
        }

        ctx.save();
        layers.forEach(function(layer, i) {
            const cnv = layer.canvas;
            const [x, y] = layer.getPosition();
            
            if(i >= index) {
                layer.render(ctx);
            }
            ctx.save();
            ctx.globalCompositeOperation = layer.blendMode;
            ctx.drawImage(cnv, x, y);
            ctx.restore();
        });
    }

    function addLayer(layer) {
        let i = layers.indexOf(layer);
        if( i >= 0) {
            return;
        }
        Canvas.instances.forEach(function (cnv) {
            if(cnv.removeLayer(layer)) {
                console.log("removed");
            }
        });
        layers.push(layer);
    }

    function removeLayer(layer) {
        let i = layers.indexOf(layer);
        if( i >= 0) {
            layers.splice(i, 1);
            return true;
        }
        return false;
    }

    if(canvas === undefined) {
        canvas = createElement('canvas', {
            parent
        });
    }

    canvas.classList.add('canvas-page');
    canvas.width = CSS.cm(21).to("px").value;
    canvas.height = CSS.cm(29.7).to("px").value;
    canvas.style.background = background;
    if(backgroundImage !== undefined) {
        canvas.style.backgroundImage = backgroundImage;
    }

    const ctx = canvas.getContext('2d');

    ctx.fillStyle = "black";
    render();

    const instance = Object.freeze({
        canvas,
        layers,
        exportPNG,
        render,
        renderLayer,
        addLayer,
        removeLayer,
    });

    Canvas.instances.push(instance);
    return instance;
}

Canvas.instances = [];
Canvas.render = function() {
    Canvas.instances.forEach(function(canvas) {
        canvas.render();
    });
};

Canvas.redraw = function() {
    Canvas.instances.forEach(function(canvas) {
        canvas.redraw();
    });
};

Canvas.export = function() {
    Canvas.instances.forEach(function(canvas, i) {
        canvas.exportPNG(`redacted_${i+1}`);
    });
};

Canvas.renderLayer = function(layer) {
    Canvas.instances.forEach(function(canvas) {
        canvas.renderLayer(layer);
    });
};

Canvas.fromTemplate = function(templateName, overrides) {
    if(templates[templateName] !== undefined) {
        return new Canvas({
            ...templates[templateName](),
            ...overrides,
        });
    } else {
        console.error(`Invalid canvas template name "${templateName}"`);
        return;
    }
};