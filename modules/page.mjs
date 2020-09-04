import {createElement} from './dom.mjs';
import Canvas from './canvas.mjs';
import Layer from './layers/base.mjs';

function Page (options={}) {
    let {
        element,
        template,
        parent,
    } = options;
    
    let canvas;
    
    if(element === undefined) {
        element = createElement('div', {
            class: "page",
            parent,
        });
    }

    const container = createElement('div', {
        class: "page-container",
        parent: element,
    });

    if(template !== undefined) {
        canvas = Canvas.fromTemplate(template, {
            parent: container,
        });
    } else {
        canvas = new Canvas({
            parent: container
        });
    }

    const layerContainer = createElement('div', {
        class: "layers",
        parent: element,
    });

    const layersLabel = createElement('label', {
        parent: layerContainer,
        text: "Layers",
    });

    /*
    const addLayerButton = createElement('button', {
        parent: layerContainer,
        text: "Add ...",
    });
    */

    const editOverlay = createElement('div', {
        class: "edit-overlay",
        parent: container
    });

    editOverlay.addEventListener('dragover', function(ev) {
        ev.preventDefault();
        ev.dataTransfer.dropEffect = "move";

    });

    editOverlay.addEventListener('drop', function(ev) {
        ev.preventDefault();
        const layerIndex = ev.dataTransfer.getData("index");

        const startX = ev.dataTransfer.getData("startX");
        const startY = ev.dataTransfer.getData("startY");
        const layer = Layer.instances[layerIndex];
        page.addLayer(layer);

        const rect = editOverlay.getBoundingClientRect();

        const scale = container.clientWidth / 792;
        const pos = layer.getPosition();
        const x = (ev.clientX - rect.x - startX) / scale;
        const y = (ev.clientY - rect.y - startY) / scale;

        layer.setPosition([x, y]);
        Redact.render();
        resize();
    });

    function addLayer(layer, skipRender=false) {
        canvas.addLayer(layer);
        layerContainer.appendChild(layer.icon);
        editOverlay.appendChild(layer.editPseudo);
        if(!skipRender) {
            canvas.render();
        }
        resize();
    }

    function resize() {
        const v = container.clientWidth / 792;
        editOverlay.style.transform = `scale(${v})`;
    }

    canvas.layers.forEach(function(layer) {
        addLayer(layer, true);
    });

    const page = Object.freeze({
        canvas,
        element,
        addLayer,
        resize,
    });

    Page.instances.push(page);

    return page;
}

Page.instances = [];

function elementVisibleHeight(element) {
    const rect = element.getBoundingClientRect();
    let h = rect.height;
    let vT = window.pageYOffset;
    let vB = window.pageYOffset + window.innerHeight;

    let eT = rect.top;
    let eB = rect.bottom;


    const T = Math.max(vT, eT);
    const B = Math.min(vB, eB);
    return B - T;
}

Page.getMostVisible = function() {
    const visiblePages = Page.instances.map(function(page) {
        return [elementVisibleHeight(page.element), page];
    }).sort().reverse();

    if(visiblePages.length === 0 || visiblePages[0][0] <= 0) {
        return undefined;
    }

    return visiblePages[0][1];
};

Page.resize = function() {
    Page.instances.forEach(function(page) {
        page.resize();
    });
};

export default Page;