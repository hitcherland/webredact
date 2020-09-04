import {createElement} from './dom.mjs';
import Canvas from './canvas.mjs';

const fonts = {};

const style = createElement('style');

window.addEventListener('load', function() {
    document.body.appendChild(style);
});

function addFont(name, url) {
    const f = new FontFace(name, `url(${url})`);
    style.innerText += `@font-face {font-family: ${f.family}; src: url(${url}); }`;
    
    f.load().then(function (f) {
        fonts[f.family] = f;
    });

    return f.family;
}

addFont("SpecialElite", "../fonts/special-elite/SpecialElite.ttf");

export {
    fonts,
    addFont
};