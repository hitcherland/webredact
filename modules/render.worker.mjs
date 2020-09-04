function Scatter(ctx, dx, dy, softness) {
    if(dy === undefined) {
        dy = dx;
    }

    const im = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;

    Array.from(new Array(h * w)).map(function(_, i) {
        const x = i % w;
        const y = Math.floor(i / w);

        let rx = 0;
        let ry = 0;

        if(dx > 1.0 || dx > Math.random()) {
            rx = dx * (Math.random() * 2 - 1);
        }

        if(dy > 1.0 || dy > Math.random()) {
            ry = dy * (Math.random() * 2 - 1);
        }

        let X = x + rx;
        if(X < 0) {
            X = 0;
        } else if(X >= w) {
            X = w - 1;
        }

        let Y = y + ry;
        if(Y < 0) {
            Y = 0;
        } else if(Y >= h) {
            Y = h - 1;
        }

        const j = Math.floor(X) + Math.floor(Y) * w;

        const I = 4 * i;
        const J = 4 * j;

        const R = Math.random() * (1 - 0.5 * softness);

        [
            im.data[I], im.data[I+1], im.data[I+2], im.data[I+3],
            im.data[J], im.data[J+1], im.data[J+2], im.data[J+3],
        ] = [
            im.data[J] * R + (1 - R) * im.data[I],
            im.data[J+1] * R + (1 - R) * im.data[I+1],
            im.data[J+2] * R + (1 - R) * im.data[I+2],
            im.data[J+3] * R + (1 - R) * im.data[I+3],
            im.data[I] * R + (1 - R) * im.data[J],
            im.data[I+1] * R + (1 - R) * im.data[J+1],
            im.data[I+2] * R + (1 - R) * im.data[J+2],
            im.data[I+3] * R + (1 - R) * im.data[J+3],
        ];
    });

    ctx.putImageData(im, 0, 0);
}

onmessage = function(evt) {
    let [canv, ...args] = ev.data.args;
    Scatter(canv.getContext('2d'), ...args);

};