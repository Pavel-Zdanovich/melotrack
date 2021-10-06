import {throwError} from "../utils/utils.js";

export class Loader {

    constructor() {
        this._map = new Map();
    }

    load(urls) {
        if (urls != null && urls instanceof Array) {
            urls.forEach((url, index) => {
                let loading = fetch(url)
                    .then(response => {
                        console.log(`${url} ACCEPTED`);
                        return response.arrayBuffer();
                    })
                    .catch(error => console.error(error));

                this._map.set(url, loading);
            });
        } else {
            throwError({urls});
        }
    }

    get(url) {
        return this._map.get(url);
    }

    set(url, value) {
        return this._map.set(url, value);
    }
}