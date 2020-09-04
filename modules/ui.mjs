import {layers} from "./layers.mjs";
import Page from "./page.mjs";

window.addEventListener('load', function() {
    const regex = /([+-])(\d+)(%?)/;

    window.addEventListener('keydown', function(ev) {
        if(ev.ctrlKey && (ev.key === "=" || ev.key === "+")) {
            ev.preventDefault();
            const zoom = document.documentElement.style.getPropertyValue('--page-zoom');
            const val = parseFloat(zoom) + 0.05;
            document.documentElement.style.setProperty('--page-zoom', val);
            Page.resize();
        } else if(ev.ctrlKey && (ev.key === "-" || ev.key === "_")) {
            ev.preventDefault();
            const zoom = document.documentElement.style.getPropertyValue('--page-zoom');
            const val = parseFloat(zoom) - 0.05;
            document.documentElement.style.setProperty('--page-zoom', val);
            Page.resize();
        } else if(ev.ctrlKey && ev.key === "0") {
            ev.preventDefault();
            document.documentElement.style.setProperty('--page-zoom', 0.5);
            Page.resize();
        }
    });


    document.querySelectorAll('[data-export]').forEach(function(exporter) {
        exporter.addEventListener('click', function(ev) {
            Redact.export(exporter.dataset.export);
        });
    });

    document.documentElement.style.setProperty('--page-zoom', 0.5);

    document.querySelectorAll('[data-zoom]').forEach(function(zoomer) {
        const zoomMethod = zoomer.dataset.zoom;
        const result = regex.exec(zoomMethod);

        let func = function() { return; };
        if(result !== null) {
            const [sign, str_int, pct] = [result[1], result[2], result[3]];

            let val = parseInt(str_int);
            if(pct === "%") {
                val /= 100;
            }

            if(sign === "-") {
                val *= -1;
            }

            func = function() {
                const zoom = document.documentElement.style.getPropertyValue('--page-zoom');
                return parseFloat(zoom) + val;
            };

        } else if(zoomMethod == 'page-width') {
            func = function() {
                return 1;
            };
        } else if(zoomMethod === 'page-height') {
            func = function() {
                const rect = document.getElementsByClassName('body')[0].getBoundingClientRect();
                const viewHeight = rect.height;
                const goalWidth = viewHeight / Math.sqrt(2);
                const availableWidth = rect.width;

                return goalWidth / availableWidth;
            };
        }

        zoomer.addEventListener('click', function(ev) {
            let val = func();
            if(val === undefined) {
                return;
            }

            if(val < 0.1) {
                val = 0.1;
            } else if (val > 2) {
                val = 2;
            }

            document.documentElement.style.setProperty('--page-zoom', val);
            Page.resize();
        });
    });


    document.querySelectorAll('[data-add]').forEach(function(adder) {
        adder.addEventListener('click', function () {
            if(adder.dataset.add === 'page') {
                Redact.addPage();
            } else if(adder.dataset.add === 'layer') {
                Redact.addLayer(new layers[adder.dataset.layer]());
            }
        });
    });
});
