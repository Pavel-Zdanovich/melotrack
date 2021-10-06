import {Track} from "./entities/track.js";
import {Tour} from "./entities/tour.js";

let tracks = [];
let counter = 0;
let attempts = 0;
while (counter < 10 && attempts < 20) {
    let id = 10000000 + Math.floor(Math.random() * 1000000);
    let url = `https://api.deezer.com/track/${id}`;
    console.log(`Try fetch ${url}`);

    await fetch(`https://cors-anywhere.herokuapp.com/${url}`)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                console.error(`Response: ${response.status}`);
            }
        })
        .then(body => {
            if (!body.error && body.preview) {
                let track = new Track(id, body.artist.name, body.title, body.preview);
                tracks.push(track);
                counter++;
            }
        })
        .catch(error => console.error(error));

    attempts++;
}

let tour = new Tour(`Random`, `Try to guess :D`, 60000, [`artist`, `title`], tracks);

export {tour};

import("./timer/configuration.js");
import("./player/configuration.js");
import("./loader/configuration.js");
import("./table/configuration.js");