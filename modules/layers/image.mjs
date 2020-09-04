import Layer from './base.mjs';
import {createElement} from '../dom.mjs';

export default function ImageLayer(_options={}) {
    let {
        src,
        ...options
    } = _options;

    const img = createElement('img', {
        src,
    });

    img.addEventListener('load', function(ev) {
        layer.setSize(img.width, img.height);
        Redact.render();
    });

    function render(topCtx, ctx) {
        if(img.src === undefined) {
            return;
        }
        ctx.drawImage(img, 0, 0, layer.getWidth(), layer.getHeight());
    }

    function setSourceFromInput(input) {
        img.src = URL.createObjectURL(input.files[0]);
    }

    const layer = new Layer({
        label: "Image",
        tools: [{
            label: "source",
            input: {
                type: "file",
            },
            get: function() { return ""; },
            set: function(v, input) { setSourceFromInput(input); }
        }],
        render,
        ...options
    });

    return layer;
}