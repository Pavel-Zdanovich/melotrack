import {throwError} from "../utils/utils.js";
import {player} from "../player/configuration.js";
import {tour} from "../script.js";

export class Loader {

    constructor() {
        this._map = new Map();
    }

    load(urls) {
        if (urls != null && urls instanceof Array) {
            urls.forEach((url) => {
                let loading = fetch(url)
                    .then(response => {
                        console.log(`${url} ACCEPTED`);
                        this._map.set(url, response);
                        return response.arrayBuffer();
                    })
                    .then(buffer => {
                        console.log(`${url} BUFFERED`);
                        this._map.set(url, buffer);
                        return player.decode(buffer);
                    }).then(buffer => {
                        console.log(`${url} DECODED`);
                        this._map.set(url, buffer);
                        return buffer;
                    })
                    .then(buffer => {
                        let track = tour.tracks.find(track => track.url === url);
                        track.setBuffer(buffer);
                        this._map.set(url, track);
                        console.log(`${url} TRACKED`);
                    })
                    .catch(error => console.error(error));

                console.log(`${url} REQUESTED`);
                this._map.set(url, loading);
            });
        } else {
            throwError({urls});
        }
    }

    get(url) {
        return this._map.get(url);
    }

    next(url) {
        let urls = Array.from(this._map.keys());
        for (let index = 0; index < this._map.size; index++) {
            if (urls[index] === url) {
                if (index <= this._map.size - 2) {
                    return this._map.get(urls[index + 1]);
                } else {
                    return this._map.get(urls[0]);
                }
            }
        }
    }

    previous(url) {
        let urls = Array.from(this._map.keys());
        for (let index = 0; index < this._map.size; index++) {
            if (urls[index] === url) {
                if (index > 0) {
                    return this._map.get(urls[index - 1]);
                } else {
                    return this._map.get(urls[this._map.size]);
                }
            }
        }
    }
}