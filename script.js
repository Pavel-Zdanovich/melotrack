import {Tour} from "./entities/tour.js";
import {Track} from "./entities/track.js";

let json = await fetch(`data/tour1.json`).then(response => response.json());

let tour = Object.setPrototypeOf(json, Tour.prototype);
tour.tracks.map(track => Object.setPrototypeOf(track, Track.prototype));

export {tour};

import("./timer/configuration.js");
import("./player/configuration.js");
import("./loader/configuration.js");
import("./table/configuration.js");