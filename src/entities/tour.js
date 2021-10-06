import {throwError} from "../utils/utils.js";
import {Track} from "./track.js";

export class Tour {

    constructor(title, description, time, background, border, keys, tracks) {
        if (typeof title === `string`) {
            this.title = title;
        } else {
            throwError({title});
        }

        if (typeof description === `string`) {
            this.description = description;
        } else {
            throwError({description});
        }

        if (typeof time === `number`) {
            this.time = time;
        } else {
            throwError({time});
        }

        if (typeof background === `string`) {
            this.background = background;
        } else {
            throwError({background});
        }

        if (typeof border === `string`) {
            this.border = border;
        } else {
            throwError({border});
        }

        if (keys != null && keys instanceof Array && typeof keys[0] === 'string') {
            this.keys = keys;
        } else {
            throwError({keys});
        }

        if (tracks != null && tracks instanceof Array && tracks[0] instanceof Track) {
            this.tracks = tracks;
        } else {
            throwError({tracks});
        }
    }

    static parse(json) {
        if (json == null) {
            throwError({json});
        }

        return new Tour(json.title, json.description, json.time, json.keys, json.tracks.map(track => Track.parse(track)));
    }
}