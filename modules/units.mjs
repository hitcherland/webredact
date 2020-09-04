export function toCanvasPixel(canvas, stringValue, value="width") {
    const unitValue = CSSUnitValue.parse(stringValue);

    let v = canvas.width;
    if(value === "height") {
        v = canvas.height;
    }

    switch(unitValue.unit) {
        case "number": 
            return unitValue.value;
        case "px":
            return unitValue.value;
        case "percent":
            return unitValue.value * v / 100.0;
        case "em":
            return unitValue.value * 10;
        default:
            console.warn("unexpected", stringValue, unitValue);
            return undefined;
    }
}

export function toCanvasPct(canvas, stringValue, value="width") {
    const unitValue = CSSUnitValue.parse(stringValue);
    let v = canvas.width;
    if(value === "height") {
        v = canvas.height;
    }

    switch(unitValue.unit) {
        case "percent":
            return unitValue.toString();
        case "number": 
            return `${unitValue.value * 100 / v}%`;
        case "px":
            return `${unitValue.value * 100 / v}%`;
        default:
            return undefined;
    }
}

export function toPixel(stringValue, value="width") {
    const unitValue = CSSUnitValue.parse(stringValue);

    let v = 792;

    if(value === "height") {
        v = 1122;
    }

    switch(unitValue.unit) {
        case "number": 
            return unitValue.value;
        case "px":
            return unitValue.value;
        case "percent":
            return unitValue.value * v / 100.0;
        case "em":
            return unitValue.value * 10;
        default:
            console.warn("unexpected", stringValue, unitValue);
            return undefined;
    }
}

export function rgbToHex(r, g, b) {
    const R = Math.floor(r * 255).toString(16);
    const G = Math.floor(g * 255).toString(16);
    const B = Math.floor(b * 255).toString(16);
    return `#${R}${G}${B}`;
}

export function hexToRgb(hex) {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
      return r + r + g + g + b + b;
    });
  
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if(result !== null) {
        const rgb = result.slice(1, 4).map(function (v) {
            return parseInt(v, 16);
        });
        return rgb;
    } else {
        return null;
    }
}