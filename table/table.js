import {throwError} from "../utils/utils.js";
import {Tour} from "../entities/tour.js";

export class Table {

    constructor(tour) {
        if (tour != null && tour instanceof Tour) {
            this._tour = tour;
        } else {
            throwError({tour});
        }
    }

    get(col, row) {
        if (col == null || typeof col !== `string` || !this._tour.keys.includes(col)) {
            throwError({col});
        }
        if (row == null || typeof row !== `number` || !this._tour.tracks.map(track => track.id).includes(row)) {
            throwError({row});
        }

        let track = this._tour.tracks.find(track => track.id === row);
        return track[col];
    }

    similarity(s1, s2) {
        let longer = s1;
        let shorter = s2;
        if (s1.length < s2.length) {
            longer = s2;
            shorter = s1;
        }
        let longerLength = longer.length;
        if (longerLength === 0) {
            return 1.0;
        }
        return (longerLength - this.#editDistance(longer, shorter)) / parseFloat(longerLength);
    }

    #editDistance(s1, s2) {
        s1 = s1.toLowerCase();
        s2 = s2.toLowerCase();

        let costs = [];
        for (let i = 0; i <= s1.length; i++) {
            let lastValue = i;
            for (let j = 0; j <= s2.length; j++) {
                if (i === 0) {
                    costs[j] = j;
                } else {
                    if (j > 0) {
                        let newValue = costs[j - 1];
                        if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
                            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                        }
                        costs[j - 1] = lastValue;
                        lastValue = newValue;
                    }
                }
            }
            if (i > 0) {
                costs[s2.length] = lastValue;
            }
        }
        return costs[s2.length];
    }
}