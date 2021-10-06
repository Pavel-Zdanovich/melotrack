import {whenLoaded} from "../app.js";
import {Loader} from "./loader.js";

let loader = new Loader();

whenLoaded.then((tour) => {
    tour.tracks.forEach(track => loader.load(track));
});

export {loader};