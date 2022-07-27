import {player} from "../player/configuration.js";

export class Loader {

    constructor() {
        this._map = new Map();
    }

    load(track) {
        const loading = fetch(track.url)
            .then(response => {
                //console.log(`${track.url} ACCEPTED`);
                this._map.set(track.url, new Promise(resolve => resolve(response)));
                return response.arrayBuffer();
            })
            .then(buffer => {
                //console.log(`${track.url} BUFFERED`);
                this._map.set(track.url, new Promise(resolve => resolve(buffer)));
                return player.decode(buffer);
            })
            .then(buffer => {
                //console.log(`${track.url} DECODED`);
                const promise = new Promise(resolve => resolve(buffer));
                this._map.set(track.url, promise);
                return promise;
            })
            .then(buffer => {
                track.setBuffer(buffer);
                //console.log(`${track.url} TRACKED`);
                const promise = new Promise(resolve => resolve(track));
                this._map.set(track.url, promise);
                return promise;
            })
            .catch(error => console.error(error));

        //console.log(`${track.url} REQUESTED`);
        this._map.set(track.url, loading);
        return loading;
    }

    get(url) {
        return this._map.get(url);
    }
}