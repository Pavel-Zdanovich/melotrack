import {Track} from "./entities/track.js";
import {Tour} from "./entities/tour.js";

document.body.firstElementChild.firstElementChild.innerHTML = `Melotrack 1`;

/*let json = await fetch(`data/tour1.json`).then(response => response.json());
let tour = Object.setPrototypeOf(json, Tour.prototype);
tour.tracks.map(track => Object.setPrototypeOf(track, Track.prototype));*/

let tracks = [];
let counter = 0;
while (counter < 10) {
    let id = 10000000 + Math.floor(Math.random() * 1000000);
    let url = `https://api.deezer.com/track/${id}`;
    console.log(url);
    fetch(url)
        .then(response => response.json())
        .then(body => {
            console.log(body);
            if (!body.error) {
                let track = new Track(id, body.artist.name, body.title);
                tracks.push(track);
                counter++;
            }
        })
        .catch(error => console.error(error));
    counter++;
}
let tour = new Tour(`Random`, `Try to guess :D`, 60000, [`author`, `title`], tracks);

export {tour};

import("./timer/configuration.js");
import("./player/configuration.js");
import("./loader/configuration.js");
import("./table/configuration.js");