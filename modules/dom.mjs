export function createElement(tag, _attributes={}) {
    const {
        style = {},
        parentElement,
        parentNode,
        parent,
        text,
        ...attributes
    } = _attributes;

    const element = document.createElement(tag);
    if(text !== undefined) {
        element.textContent = text;
    }
        
    Object.entries(attributes).forEach(function(entry) {
        let [key, value] = entry;
        element.setAttribute(key, value);
    });

    Object.entries(style).forEach(function(entry) {
        let [key, value] = entry;
        element.style[key] = value;
    });

    if(parent !== undefined) {
        parent.appendChild(element);
    } else if(parentElement !== undefined) {
        parentElement.appendChild(element);
    } else if(parentNode !== undefined) {
        parentNode.appendChild(element);
    }

    return element;
}

export function createTool(options={}) {
    const {
        label,
        icon,
        inputTag = "input",
        input = {},
        get = function() {},
        set = function(v) {},
    } = options;

    const container = createElement("div", {
        class: "tool",
    });

    if(icon === undefined) {
        const toolLabel = createElement("label", {
            text: label,
            parent: container,
        });
    } else {
        const toolLabel = createElement("img", {
            src: icon,
            title: label,
            parent: container,
        });
    }

    
    const toolInput = createElement(inputTag, {
        value: get(),
        parent: container,
        ...input
    });

    toolInput.addEventListener('change', function() {
        set(toolInput.value, toolInput);
        Redact.render();
    });

    return container;
}

export function createModal(label, attributes={}, children=[]) {
    const element = createElement("div", attributes);
    element.classList.add("modal");

    createElement("div", {
        text: label + " Layer: Edit Properties",
        parent: element,
    });

    children.forEach(function(child) {
        const {
            label:labelText,
            get,
            set,
            tag = "input",
            attributes,
        } = child;

        const container = createElement('div', {
            class: "input-container",
            parent: element
        });

        const label = createElement("label", {
            parent: container,
            text: labelText,
        });

        const input = createElement(tag, {
            parent: container,
            ...attributes
        });
        input.value = get();
        input.addEventListener('change', function() {
            set(input.value);
            Redact.render();
        });

    });

    return element;
}