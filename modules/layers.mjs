import TextLayer from './layers/text.mjs';
import ImageLayer from './layers/image.mjs';
import FoldLayer from './layers/fold.mjs';
import RGBANoiseLayer from './layers/noise.mjs';
import ScatterLayer from './layers/scatter.mjs';
import BoxLayer from './layers/box.mjs';

const layers = Object.freeze({
    "box": BoxLayer,
    "fold": FoldLayer,
    "image": ImageLayer,
    "noise": RGBANoiseLayer,
    "scatter": ScatterLayer,
    "text": TextLayer,
});

export {
    BoxLayer,
    FoldLayer,
    ImageLayer,
    RGBANoiseLayer,
    ScatterLayer,
    TextLayer,
    layers
};