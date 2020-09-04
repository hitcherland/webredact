import {TextLayer, RGBANoiseLayer, ScatterLayer, BoxLayer, FoldLayer, ImageLayer} from '../layers.mjs';

export default function() {
    return {
        layers: [new RGBANoiseLayer({
            minRGBA: [0.8, 0.8, 0.8, 1.0],
            maxRGBA: [1.0, 1.0, 1.0, 1.0],
        }), new BoxLayer({
            strokeStyle: "#000000",
            position: ["2.5%", "2.5%"],
            lineWidth: 3,
            pattern: "diagonals",
            width: "95%",
            height:  "5%",
            actions: ["stroke", "fill"]
        }), new BoxLayer({
            strokeStyle: "#000000",
            position: ["2.5%", "92.5%"],
            lineWidth: 3,
            pattern: "diagonals",
            width: "95%",
            height:  "5%",
            actions: ["stroke", "fill"]
        }), new BoxLayer({
            strokeStyle: "#000000",
            position: ["2.5%", "2.5%"],
            lineWidth: 3,
            width: "95%",
            height: "95%",
            actions: ["stroke"],
        }), new TextLayer({
            text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam in sollicitudin eros. Vivamus facilisis tincidunt lorem, sed porta ex maximus eget. Etiam est nisi, blandit id ultrices quis, vehicula sed leo. Quisque condimentum metus bibendum lectus congue, vitae vestibulum massa interdum. Nulla sed dolor id tortor condimentum facilisis a et libero. Curabitur a feugiat turpis, quis dapibus felis. Quisque ultrices ante at bibendum luctus. Donec efficitur dapibus felis. Nulla ullamcorper neque a purus suscipit blandit. Praesent euismod felis eu sapien porta iaculis. Donec congue lectus sit amet nulla consequat fringilla.

            Morbi at molestie magna. Nullam laoreet tempor turpis, a pellentesque lectus convallis eu. Ut venenatis tincidunt dui id lacinia. Nullam facilisis vestibulum aliquet. Suspendisse vestibulum luctus placerat. Vestibulum vel molestie nisl, ut rhoncus justo. Mauris bibendum ut sapien ut aliquam. Proin vel odio eu velit pellentesque congue eu sed ligula. Praesent id tortor at eros eleifend volutpat lacinia nec arcu. Maecenas pretium lectus quis libero tempus eleifend. Sed purus enim, hendrerit et odio eu, gravida porttitor odio. In vitae ipsum at libero convallis egestas.`,
            position: ["7.5%", "10%"],
            width: "85%",
            height: "80%",
            fillStyle: "#000000",
        }), new ImageLayer({
            src: "redacted.png",
            filter: 'grayscale(100%) brightness(0.5)',
            position: ["25%", "71%"],
        }), new FoldLayer({
            horizontalFolds: 2,
            verticalFolds: 1,
        }), new ScatterLayer({
            dx: 2.0,
            dy: 3.0,
            softness: 1.0,
        })]
    };
}