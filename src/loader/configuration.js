import {onLoad} from "../app.js";
import {Loader} from "./loader.js";

let loader = new Loader();

onLoad.then((tour) => {
    tour.tracks.forEach(track => loader.load(track));
});

export {loader};