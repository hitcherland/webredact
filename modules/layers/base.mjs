import {createElement, createTool, createModal} from '../dom.mjs';
import {toCanvasPixel, toPixel} from '../units.mjs';

const resizeObserver = new ResizeObserver(function(entries) {
    let hasChange = false;
    entries.forEach(function (entry) {
        const matches = Layer.instances.filter(function(v) {
            return v.editPseudo === entry.target;
        });

        if(entry.target.computedStyleMap().get("display").value === "none") {
            return;
        }

        const layer = matches[0];
        layer.setSize(entry.contentRect.width, entry.contentRect.height);
        hasChange = true;
    });

    if(hasChange) {
        Redact.render();
    }
});

export default function Layer(options={}) {
    let {
        label,
        selectable = true,
        position:inPosition,
        blendMode = "normal",
        width:inWidth,
        height:inHeight,
        tools:inTools = [],
        filter,
        render:in_render,
        ...extras
    } = options;

    function makeActive(ev) {
        const toolsElement = document.getElementById('tools');
        document.querySelectorAll('[data-active]').forEach(function(el) {
            el.dataset.active = false;
        });

        icon.dataset.active = true;
        editPseudo.dataset.active = true;


        Array.from(toolsElement.children).forEach(function(tool) {
            toolsElement.removeChild(tool);
        });
        
        layer.tools.forEach(function (tool) {
            toolsElement.appendChild(tool);
        });

        ev.preventDefault();
        ev.stopPropagation();
    }

    function getHeight() { return height; }
    function setHeight(v) {
        const V = toPixel(v, "height");
        height = V;
        editPseudo.style.height = V;
        canvas.height = V;
    }

    function getWidth() { return width; }
    function setWidth(v) {
        const V = toPixel(v, "width");
        width = V;
        editPseudo.style.width = V;
        canvas.width = V;
    }

    function getPosition() { return position; }
    function setPosition(v) { 

        const x = toPixel(v[0], "width");
        const y = toPixel(v[1], "height");

        position[0] = x;
        position[1] = y;
        editPseudo.style.left = x + "px";
        editPseudo.style.top = y + "px";
    }

    function setSize(w, h) {
        const W = w === undefined ? width: toPixel(w, "width");
        const H = h === undefined ? height: toPixel(h, "height");

        height = H;
        width = W;

        editPseudo.style.width = W + "px";
        editPseudo.style.height = H + "px";
        canvas.width = W;
        canvas.height = H;
    }

    function render(topCtx) {
        ctx.filter = filter;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if(in_render !== undefined) {
            in_render(topCtx, ctx);
        }

        /*
        canvas.convertToBlob().then(function (b) {
            blobUrl = URL.createObjectURL(b);
        });
        */
    }

    const position = [0, 0];
    let width = 792;
    let height = 1122;
    let tools = [];

    let blobUrl;

    const icon = createElement("div", {
        class: "layer-icon",
        text: label
    });

    const editPseudo = createElement("div", {
        class: "edit-pseudo",
        draggable: true,
    });
    icon.addEventListener('click', makeActive);

    if(!selectable) {
        editPseudo.style.pointerEvents = "none";
    } else {
        editPseudo.addEventListener('click', makeActive);
        editPseudo.addEventListener('dragstart', function(ev) {
            const rect = editPseudo.getBoundingClientRect();

            const x = ev.clientX - rect.x;
            const y = ev.clientY - rect.y;

            //ev.dataTransfer.setDragImage(img, x, y);
            ev.dataTransfer.setData("index", Layer.instances.indexOf(layer));
            ev.dataTransfer.setData("startX", x);
            ev.dataTransfer.setData("startY", y);
            ev.dataTransfer.effectAllowed = "move";
        });
    }

    resizeObserver.observe(editPseudo);

    //const canvas = new OffscreenCanvas(toPixel(width, "width"), toPixel(width, "width"));
    const canvas = createElement("canvas", {
        width: toPixel(width, "width"),
        height: toPixel(width, "width")
    });
    const ctx = canvas.getContext('2d');

    if(inPosition) {
        setPosition(inPosition);
    }
    setSize(inWidth, inHeight);


    const layer = Object.freeze({
        canvas,
        tools,
        blendMode,
        icon,
        editPseudo,
        getHeight,
        setHeight,
        getWidth,
        setWidth,
        setSize,
        getPosition,
        setPosition,
        render,
        ...extras
    });

    tools.push(...[
        createTool({
            label: "x",
            get: function() { return layer.getPosition()[0]; },
            set: function(v) { layer.setPosition([v, position[0]]); },
        }),
        createTool({
            label: "y",
            get: function() { return layer.getPosition()[1]; },
            set: function(v) { layer.setPosition([position[1], v]); },
        }),
        createTool({
            label: "width", 
            get: function() { return layer.getWidth(); },
            set: function(v) { layer.setWidth(v); },
        }),
        createTool({
            label: "height", 
            get: function() { return layer.getHeight(); },
            set: function(v) { layer.setHeight(v); },
        }),
        ...inTools.map(function(opt) {
            return createTool(opt);
        })
    ]);

    Layer.instances.push(layer);

    return layer;
}

Layer.instances = [];