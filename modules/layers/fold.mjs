import Layer from './base.mjs';

export default function FoldLayer(_options={}) {
    let {
        verticalFolds = 1,
        horizontalFolds = 1,

        ...options
    } = _options;

    const folds = [];

    function calculateFolds() {
        folds.splice(0, folds.length);

        for(let i=0; i<horizontalFolds; i++) {
            folds.push({
                start: [0, (i+1) / (horizontalFolds + 1)],
                end: [1, (i+1) / (horizontalFolds + 1)],
                jiggle: [0, 0.01],
            });
        }
    
        for(let i=0; i<verticalFolds; i++) {
            folds.push({
                start: [(i + 1) / (verticalFolds + 1), 0],
                end: [(i + 1) / (verticalFolds + 1), 1],
                jiggle: [0.03, 0],
            });
        }
    }

    calculateFolds();


    function render(topCtx, ctx) {
        const w = ctx.canvas.width;
        const h = ctx.canvas.height;

        const lx = 5e-1 * w;
        ctx.lineWidth = lx;

        folds.forEach(function(fold) {
            let {
                start,
                end,
                jiggle
            } = fold;


            const x1 = w * (start[0] + (Math.random() * 2 - 1) * jiggle[0]);
            const y1 = h * (start[1] + (Math.random() * 2 - 1) * jiggle[1]);

            const x2 = w * (end[0] + (Math.random() * 2 - 1) * jiggle[0]);
            const y2 = h * (end[1] + (Math.random() * 2 - 1) * jiggle[1]);

            const cx = (x1 + x2) / 2;
            const cy = (y1 + y2) / 2;
            
            let vx = (x2 - x1);
            let vy = (y2 - y1);
            let vr = Math.sqrt(vx * vx + vy * vy);
            vx /= vr;
            vy /= vr;

            const gx1 = cx - vy * 0.5 * lx;
            const gx2 = cx + vy * 0.5 * lx;

            const gy1 = cy + vx * 0.5 * lx;
            const gy2 = cy - vx * 0.5 * lx;

            const grad = ctx.createLinearGradient(gx1, gy1, gx2, gy2);

            grad.addColorStop(0, 'transparent');
            grad.addColorStop(0.49, 'rgba(0, 0, 0, 0.1)');
            grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)');
            grad.addColorStop(0.51, 'rgba(0, 0, 0, 0.1)');
            grad.addColorStop(1, 'transparent');


            ctx.strokeStyle = grad;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        });
    }

    return new Layer({
        label: "Fold",
        selectable: false,
        tools: [{
            label: "xFolds",
            input: {
                type: "number",
                min: 0,
            },
            get: function() { return horizontalFolds; },
            set: function(v) { horizontalFolds = parseInt(v); calculateFolds(); }
        }, {
            label: "yFolds",
            input: {
                type: "number",
                min: 0,
            },
            get: function() { return verticalFolds; },
            set: function(v) { verticalFolds = parseInt(v); calculateFolds(); }
        }],
        render,
        ...options
    });
}