import {player} from "../player/configuration.js";

export class Loader {

    constructor() {
        this._map = new Map();
    }

    load(track) {
        let loading = fetch(track.url)
            .then(response => {
                console.log(`${track.url} ACCEPTED`);
                this._map.set(track.url, response);
                return response.arrayBuffer();
            })
            .then(buffer => {
                console.log(`${track.url} BUFFERED`);
                this._map.set(track.url, buffer);
                return player.decode(buffer);
            }).then(buffer => {
                console.log(`${track.url} DECODED`);
                this._map.set(track.url, buffer);
                return buffer;
            })
            .then(buffer => {
                track.setBuffer(buffer);
                this._map.set(track.url, track);
                console.log(`${track.url} TRACKED`);
            })
            .catch(error => console.error(error));

        console.log(`${track.url} REQUESTED`);
        this._map.set(track.url, loading);
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