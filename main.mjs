import './modules/fonts.mjs';
import './modules/ui.mjs';
import Canvas from './modules/canvas.mjs';
import Page from './modules/page.mjs';

window.addEventListener('load', function() {
    const pagesElement = document.getElementById('pages');

    new Page({
        template: "simple",
        parent: pagesElement
    });

    let hasRequest = false;
    function requestRender() {
        if(hasRequest) {
            return;
        }
        
        hasRequest = true;
        requestAnimationFrame(function (t) {
            Canvas.render();
            Page.resize();
            hasRequest = false;
        });
    }

    window.Redact = Object.freeze({
        render: requestRender,
        export: Canvas.export,
        renderLayer: Canvas.renderLayer,
        addPage: function() {
            new Page({
                parent: pagesElement
            });        
            Page.resize();
        },
        addLayer: function(layer) {
            const page = Page.getMostVisible();
            page.addLayer(layer);
        },
    });

    document.addEventListener('click', function(ev) {  
        document.querySelectorAll('[data-active]').forEach(function(el) {
            el.dataset.active = false;
        });
    });

    window.addEventListener('resize', function(ev) {
        requestRender();
    });
});