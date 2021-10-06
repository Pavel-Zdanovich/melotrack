import {tour} from "../script.js";
import {Loader} from "./loader.js";

let loader = new Loader();
loader.load(tour.tracks.map(track => track.url));

export {loader};